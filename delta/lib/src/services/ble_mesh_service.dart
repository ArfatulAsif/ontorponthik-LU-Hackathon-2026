import 'dart:async';

import 'package:flutter/foundation.dart'
    show
        TargetPlatform,
        debugPrint,
        defaultTargetPlatform,
        kDebugMode,
        kIsWeb;
import 'package:flutter/services.dart';
import 'package:flutter_ble_peripheral/flutter_ble_peripheral.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

import '../ble/mesh_presence_codec.dart';
import 'sync_engine.dart';

/// Singleton for Digital Delta BLE mesh: scan (central) + advertise (peripheral).
///
/// Peers only appear in [discoveredDevices] if they **advertise** the same
/// [digitalDeltaServiceUuid]. Classic Bluetooth pairing is not enough.
///
/// **Android 12+ (API 31+):** [BLUETOOTH_ADVERTISE] must be granted by the user —
/// the OS does not allow silent advertising for normal apps.
///
/// Uses [permission_handler] only (no `device_info_plus`) so a missing
/// native plugin does not break permission flows.
class BleMeshService {
  BleMeshService._();

  static final BleMeshService instance = BleMeshService._();

  final FlutterBlePeripheral _blePeripheral = FlutterBlePeripheral();

  /// Set after [MissingPluginException] so we do not spam a broken channel.
  bool _peripheralPluginUnavailable = false;

  /// Primary GATT service UUID advertised by mesh peers (must match scan filter).
  static const String digitalDeltaServiceUuid = '12ab34cd-56ef-7890-1234-56789abcdef0';

  /// GATT characteristic for mesh binary frames ([pb.SyncEnvelope], etc.).
  static const String meshDataCharacteristicUuid =
      '12ab34cd-56ef-7890-1234-56789abcd001';

  static const MethodChannel _gattMesh = MethodChannel('com.example.delta/gatt_mesh');

  static final Guid _serviceGuid = Guid(digitalDeltaServiceUuid);
  static final Guid _meshDataCharGuid = Guid(meshDataCharacteristicUuid);

  static bool _gattMeshBridgeReady = false;

  /// Central-role notify subscriptions: mesh [SyncEnvelope] frames from peers.
  final Map<String, StreamSubscription<List<int>>> _meshInboundSubs =
      <String, StreamSubscription<List<int>>>{};

  static bool get _isAndroidOrIos =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  /// Live scan results (deduplicated list from the stack).
  Stream<List<ScanResult>> get discoveredDevices => FlutterBluePlus.scanResults;

  /// `true` if Bluetooth is available and powered on after this call.
  Future<bool> checkAndEnableBluetooth() async {
    if (!await FlutterBluePlus.isSupported) {
      return false;
    }
    if (FlutterBluePlus.adapterStateNow == BluetoothAdapterState.on) {
      return true;
    }
    try {
      await FlutterBluePlus.turnOn();
      await FlutterBluePlus.adapterState
          .where((BluetoothAdapterState s) => s == BluetoothAdapterState.on)
          .first
          .timeout(const Duration(seconds: 60));
      return true;
    } on Object {
      return FlutterBluePlus.adapterStateNow == BluetoothAdapterState.on;
    }
  }

  /// True when this device uses Android 12+ style Bluetooth scan permission.
  Future<bool> _usesModernBlePermissions() async {
    if (defaultTargetPlatform != TargetPlatform.android) {
      return false;
    }
    return Permission.bluetoothScan.isGranted;
  }

  /// Call once from [InitScreen] (and before mesh operations).
  ///
  /// Requests both modern (API 31+) and legacy permissions; [permission_handler]
  /// applies the correct set per OS version.
  Future<bool> requestAllPermissions() async {
    if (kIsWeb) {
      return true;
    }
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      await Permission.location.request();
      return true;
    }
    if (defaultTargetPlatform != TargetPlatform.android) {
      return true;
    }

    final Map<Permission, PermissionStatus> s = await <Permission>[
      Permission.bluetoothScan,
      Permission.bluetoothConnect,
      Permission.bluetoothAdvertise,
      Permission.bluetooth,
      Permission.location,
    ].request();

    final bool connect = s[Permission.bluetoothConnect]?.isGranted ?? false;
    if (!connect) {
      return false;
    }

    final bool scanModern = s[Permission.bluetoothScan]?.isGranted ?? false;
    final bool scanLegacy = s[Permission.bluetooth]?.isGranted ?? false;
    if (!scanModern && !scanLegacy) {
      return false;
    }

    final bool loc = (s[Permission.location]?.isGranted ?? false) ||
        (s[Permission.location]?.isLimited ?? false);
    if (!loc && kDebugMode) {
      debugPrint(
        'BLE: location not granted — some OEMs still need it for discovery.',
      );
    }

    final bool advertise = s[Permission.bluetoothAdvertise]?.isGranted ?? false;

    if (scanModern) {
      return advertise;
    }
    // Legacy Android (no BLUETOOTH_SCAN): advertise permission does not apply the same way.
    return loc;
  }

  /// Delegates to [requestAllPermissions] (keeps older call sites working).
  Future<bool> requestPermissions() => requestAllPermissions();

  /// Android 12+ style: ensures [BLUETOOTH_ADVERTISE] is granted when using modern scan.
  Future<bool> ensureAndroidAdvertisePermission() async {
    if (defaultTargetPlatform != TargetPlatform.android) {
      return true;
    }
    if (!await _usesModernBlePermissions()) {
      return true;
    }
    PermissionStatus status = await Permission.bluetoothAdvertise.status;
    if (status.isGranted || status.isLimited) {
      return true;
    }
    status = await Permission.bluetoothAdvertise.request();
    if (status.isGranted || status.isLimited) {
      return true;
    }
    if (kDebugMode) {
      debugPrint(
        'BLUETOOTH_ADVERTISE not granted ($status). '
        'On Android 12+, allow Nearby devices / Bluetooth advertising.',
      );
    }
    return false;
  }

  /// Whether Android denied advertise permanently (user must open Settings).
  Future<bool> get isAndroidAdvertisePermanentlyDenied async {
    if (defaultTargetPlatform != TargetPlatform.android) {
      return false;
    }
    return Permission.bluetoothAdvertise.isPermanentlyDenied;
  }

  /// Ensures the radio is on (prompts on Android when possible).
  Future<void> ensureAdapterOn() async {
    final bool ok = await checkAndEnableBluetooth();
    if (!ok) {
      throw StateError(
        'Bluetooth is off or not supported. Turn it on and try again.',
      );
    }
  }

  /// Starts scanning for advertisers exposing [digitalDeltaServiceUuid].
  Future<void> startScanning({Duration? timeout}) async {
    try {
      await FlutterBluePlus.stopScan();
    } on Object {
      // ignore — no scan in progress
    }
    await FlutterBluePlus.startScan(
      withServices: <Guid>[_serviceGuid],
      timeout: timeout,
      androidUsesFineLocation: false,
      androidCheckLocationServices: false,
    );
  }

  Future<void> stopScanning() async {
    try {
      await FlutterBluePlus.stopScan();
    } on Object {
      // ignore
    }
  }

  /// Polls native [isAdvertising] — needed because the plugin updates state
  /// asynchronously and a single read right after [start] often returns false.
  Future<bool> _waitUntilAdvertisingConfirms({
    Duration timeout = const Duration(milliseconds: 2500),
    Duration step = const Duration(milliseconds: 80),
  }) async {
    final DateTime deadline = DateTime.now().add(timeout);
    while (DateTime.now().isBefore(deadline)) {
      if (await _blePeripheral.isAdvertising) {
        return true;
      }
      await Future<void>.delayed(step);
    }
    return _blePeripheral.isAdvertising;
  }

  /// Starts **without** an active BLE scan, then advertises, then resumes scan.
  ///
  /// Many devices fail to start advertising while [FlutterBluePlus.startScan]
  /// is running; stopping scan briefly avoids that radio contention.
  Future<bool> startMeshSession({
    Duration? scanTimeout,
    int roleValue = 1,
    String displayName = 'Peer',
  }) async {
    await ensureAdapterOn();

    if (defaultTargetPlatform == TargetPlatform.android) {
      await requestAllPermissions();

      if (!await Permission.bluetoothConnect.isGranted) {
        throw StateError(
          'Bluetooth connect permission is required to talk to peers.',
        );
      }

      final bool scanOk = await Permission.bluetoothScan.isGranted ||
          await Permission.bluetooth.isGranted;
      if (!scanOk) {
        throw StateError(
          'Bluetooth scan permission is required. Enable it in app settings.',
        );
      }

      if (await _usesModernBlePermissions() &&
          !await Permission.bluetoothAdvertise.isGranted) {
        if (kDebugMode) {
          debugPrint(
            'BLUETOOTH_ADVERTISE denied — peers cannot discover this device until granted.',
          );
        }
      }

      if (!await Permission.bluetoothScan.isGranted &&
          await Permission.bluetooth.isGranted) {
        if (!await Permission.location.isGranted &&
            !await Permission.location.isLimited) {
          throw StateError(
            'Location permission is required for BLE scan on this Android version.',
          );
        }
      }
    }

    await stopScanning();
    await Future<void>.delayed(const Duration(milliseconds: 250));
    final bool advertised = await startAdvertisingMeshPresence(
      roleValue: roleValue,
      displayName: displayName,
    );
    await startScanning(timeout: scanTimeout);
    await _ensureGattMeshBridge();
    return advertised;
  }

  /// Android: host GATT server so peers can write CRDT / sync payloads.
  Future<void> _ensureGattMeshBridge() async {
    if (_gattMeshBridgeReady || kIsWeb || defaultTargetPlatform != TargetPlatform.android) {
      return;
    }
    _gattMeshBridgeReady = true;
    _gattMesh.setMethodCallHandler((MethodCall call) async {
      if (call.method == 'onMeshData') {
        final List<int> raw = _bytesFromPlatform(call.arguments);
        await SyncEngine().handleIncomingSync(raw);
      }
    });
    try {
      await _gattMesh.invokeMethod<bool>('start');
    } on MissingPluginException catch (_) {
      _gattMeshBridgeReady = false;
    } on Object catch (e, st) {
      _gattMeshBridgeReady = false;
      if (kDebugMode) {
        debugPrint('GATT mesh server start failed: $e\n$st');
      }
    }
  }

  List<int> _bytesFromPlatform(Object? arguments) {
    if (arguments == null) {
      return <int>[];
    }
    if (arguments is List<int>) {
      return arguments;
    }
    return List<int>.from(arguments as List<dynamic>);
  }

  Future<void> stopGattMeshServer() async {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) {
      return;
    }
    try {
      await _gattMesh.invokeMethod<void>('stop');
    } on Object {
      // ignore
    }
  }

  /// Cancels all GATT notify listeners created by [attachMeshSyncListener].
  void disposeMeshSyncListeners() {
    for (final StreamSubscription<List<int>> sub in _meshInboundSubs.values) {
      sub.cancel();
    }
    _meshInboundSubs.clear();
  }

  /// After a BLE link exists, enable notify and forward [SyncEnvelope] bytes to [SyncEngine].
  ///
  /// Returns the mesh characteristic when notify was enabled (caller may [write] the same).
  Future<BluetoothCharacteristic?> attachMeshSyncListener(
    BluetoothDevice device,
  ) async {
    if (kIsWeb) {
      return null;
    }
    final String rid = device.remoteId.str;
    await _meshInboundSubs[rid]?.cancel();
    _meshInboundSubs.remove(rid);

    List<BluetoothService> services = device.servicesList;
    if (services.isEmpty) {
      await device.discoverServices();
      services = device.servicesList;
    }
    final BluetoothCharacteristic? ch = meshDataCharacteristicFor(services);
    if (ch == null) {
      if (kDebugMode) {
        debugPrint('attachMeshSyncListener: no mesh char on $rid');
      }
      return null;
    }
    final bool canNotify = ch.properties.notify || ch.properties.indicate;
    if (!canNotify) {
      if (kDebugMode) {
        debugPrint('attachMeshSyncListener: characteristic has no notify on $rid');
      }
      return ch;
    }
    try {
      await ch.setNotifyValue(true);
    } on Object catch (e, st) {
      if (kDebugMode) {
        debugPrint('attachMeshSyncListener setNotifyValue failed: $e\n$st');
      }
      return ch;
    }
    final StreamSubscription<List<int>> sub = ch.onValueReceived.listen(
      (List<int> bytes) async {
        if (bytes.isEmpty) {
          return;
        }
        try {
          await SyncEngine().handleIncomingSync(bytes);
        } on Object catch (e, st) {
          if (kDebugMode) {
            debugPrint('mesh inbound SyncEnvelope error: $e\n$st');
          }
        }
      },
    );
    _meshInboundSubs[rid] = sub;
    return ch;
  }

  /// Writes [payload] to every **currently connected** peripheral that exposes the mesh char.
  ///
  /// Call after the user taps **Sync** on a peer so [FlutterBluePlus.connectedDevices] is
  /// non-empty. Also (re)attaches notify listeners so inbound CRDT updates merge locally.
  Future<int> writeResourceCounterToConnectedPeers(List<int> payload) async {
    if (kIsWeb || payload.isEmpty) {
      return 0;
    }
    final List<BluetoothDevice> connected = FlutterBluePlus.connectedDevices;
    if (connected.isEmpty) {
      if (kDebugMode) {
        debugPrint('writeResourceCounterToConnectedPeers: no connected devices');
      }
      return 0;
    }
    int ok = 0;
    for (final BluetoothDevice d in connected) {
      try {
        try {
          await d.requestMtu(512);
        } on Object {
          // ignore
        }
        if (d.servicesList.isEmpty) {
          await d.discoverServices();
        }
        final BluetoothCharacteristic? ch = await attachMeshSyncListener(d);
        if (ch == null) {
          continue;
        }
        final bool noResp = ch.properties.writeWithoutResponse;
        await ch.write(
          payload,
          withoutResponse: noResp,
          allowLongWrite: true,
        );
        ok++;
      } on Object catch (e, st) {
        if (kDebugMode) {
          debugPrint('writeResourceCounterToConnectedPeers ${d.remoteId}: $e\n$st');
        }
      }
    }
    return ok;
  }

  /// Resolves the mesh data characteristic on a connected peripheral.
  BluetoothCharacteristic? meshDataCharacteristicFor(
    List<BluetoothService> services,
  ) {
    final Guid svc = Guid(digitalDeltaServiceUuid);
    for (final BluetoothService s in services) {
      if (s.uuid == svc) {
        for (final BluetoothCharacteristic c in s.characteristics) {
          if (c.uuid == _meshDataCharGuid) {
            return c;
          }
        }
      }
    }
    return null;
  }

  /// Pushes [payload] to every currently discovered peer (central → peripheral write).
  ///
  /// Returns how many peers accepted a write. Requires peers to run this app with
  /// GATT server active (Android) and to be visible in [FlutterBluePlus.lastScanResults].
  Future<int> broadcastResourceCounterSync(List<int> payload) async {
    if (kIsWeb || payload.isEmpty) {
      return 0;
    }
    final Map<String, ScanResult> unique = <String, ScanResult>{};
    for (final ScanResult sr in FlutterBluePlus.lastScanResults) {
      unique[sr.device.remoteId.str] = sr;
    }
    if (unique.isEmpty) {
      if (kDebugMode) {
        debugPrint('broadcastResourceCounterSync: no scan results — scan may be empty.');
      }
      return 0;
    }
    int ok = 0;
    for (final ScanResult sr in unique.values) {
      final BluetoothDevice d = sr.device;
      try {
        await d.connect(
          license: License.free,
          timeout: const Duration(seconds: 22),
        );
        try {
          await d.requestMtu(512);
        } on Object {
          // ignore — some stacks omit MTU negotiation
        }
        final List<BluetoothService> services = await d.discoverServices();
        final BluetoothCharacteristic? ch = meshDataCharacteristicFor(services);
        if (ch == null) {
          if (kDebugMode) {
            debugPrint('No mesh data char on ${d.remoteId.str}');
          }
        } else {
          final bool noResp = ch.properties.writeWithoutResponse;
          await ch.write(
            payload,
            withoutResponse: noResp,
            allowLongWrite: true,
          );
          ok++;
        }
      } on Object catch (e, st) {
        if (kDebugMode) {
          debugPrint('broadcast to ${d.remoteId.str}: $e\n$st');
        }
      } finally {
        try {
          await d.disconnect();
        } on Object {
          // ignore
        }
      }
    }
    return ok;
  }

  /// Runs [startAdvertisingMeshPresence] twice with a delay (radio quirk workaround).
  Future<bool> startAdvertisingWithRetry({
    Duration betweenAttempts = const Duration(milliseconds: 800),
  }) async {
    final bool first = await startAdvertisingMeshPresence();
    if (first) {
      return true;
    }
    await Future<void>.delayed(betweenAttempts);
    return startAdvertisingMeshPresence();
  }

  /// Starts BLE peripheral advertising: service UUID + scan-response [MeshPresenceCodec] payload.
  Future<bool> startAdvertisingMeshPresence({
    int roleValue = 1,
    String displayName = 'Peer',
  }) async {
    if (!_isAndroidOrIos) {
      return false;
    }
    if (_peripheralPluginUnavailable) {
      return false;
    }
    try {
      if (!await _blePeripheral.isSupported) {
        return false;
      }
      if (defaultTargetPlatform == TargetPlatform.android) {
        final bool advertiseOk = await ensureAndroidAdvertisePermission();
        if (!advertiseOk) {
          return false;
        }
      }
      await _blePeripheral.requestPermission();

      final AdvertiseData data = AdvertiseData(
        serviceUuid: digitalDeltaServiceUuid,
        includeDeviceName: false,
      );

      final List<int> presenceBytes = MeshPresenceCodec.encode(
        roleValue: roleValue,
        displayName: displayName,
      );
      final AdvertiseData responseData = AdvertiseData(
        manufacturerId: MeshPresenceCodec.manufacturerId,
        manufacturerData: Uint8List.fromList(presenceBytes),
        includeDeviceName: false,
      );

      Future<bool> tryOnce({
        required AdvertiseSettings settings,
        AdvertiseSetParameters? setParams,
        bool includePresencePayload = true,
      }) async {
        try {
          await _blePeripheral.start(
            advertiseData: data,
            advertiseSettings: settings,
            advertiseSetParameters: setParams,
            advertiseResponseData: includePresencePayload ? responseData : null,
          );
        } on PlatformException catch (e, st) {
          if (kDebugMode) {
            debugPrint('BLE advertising PlatformException: $e\n$st');
          }
          return false;
        }
        final bool ok = await _waitUntilAdvertisingConfirms();
        if (!ok && kDebugMode) {
          debugPrint(
            'BLE: start() finished but isAdvertising never became true '
            '(OEM limit, permissions, or payload).',
          );
        }
        return ok;
      }

      final AdvertiseSettings legacy = AdvertiseSettings(
        advertiseSet: false,
        connectable: true,
        timeout: 0,
        advertiseMode: AdvertiseMode.advertiseModeLowLatency,
        txPowerLevel: AdvertiseTxPower.advertiseTxPowerHigh,
      );

      if (await tryOnce(settings: legacy)) {
        return true;
      }

      if (kDebugMode) {
        debugPrint('BLE: retry advertising without mesh presence payload (size/OEM).');
      }
      if (await tryOnce(settings: legacy, includePresencePayload: false)) {
        return true;
      }

      await Future<void>.delayed(const Duration(milliseconds: 400));

      if (defaultTargetPlatform == TargetPlatform.android) {
        final AdvertiseSettings extended = AdvertiseSettings(
          advertiseSet: true,
          connectable: true,
          timeout: 0,
          advertiseMode: AdvertiseMode.advertiseModeLowLatency,
          txPowerLevel: AdvertiseTxPower.advertiseTxPowerHigh,
        );
        final AdvertiseSetParameters setParams = AdvertiseSetParameters(
          connectable: true,
          legacyMode: true,
        );
        if (await tryOnce(
              settings: extended,
              setParams: setParams,
            )) {
          return true;
        }
        if (await tryOnce(
              settings: extended,
              setParams: setParams,
              includePresencePayload: false,
            )) {
          return true;
        }
      }

      return false;
    } on MissingPluginException catch (e, st) {
      _peripheralPluginUnavailable = true;
      if (kDebugMode) {
        debugPrint(
          'flutter_ble_peripheral: MissingPluginException — run: '
          'flutter clean && flutter pub get && flutter run\n$st',
        );
      }
      return false;
    } on Object catch (e, st) {
      if (kDebugMode) {
        debugPrint('BLE advertising error: $e\n$st');
      }
      return false;
    }
  }

  /// Stops peripheral advertising (e.g. when leaving the mesh screen).
  Future<void> stopAdvertisingMeshPresence() async {
    if (!_isAndroidOrIos || _peripheralPluginUnavailable) {
      await stopGattMeshServer();
      return;
    }
    try {
      await _blePeripheral.stop();
    } on MissingPluginException {
      _peripheralPluginUnavailable = true;
    } on Object {
      // ignore
    }
    await stopGattMeshServer();
  }

  /// Connects and runs GATT service discovery + mesh notify bridge.
  ///
  /// **Android GATT 133:** Very often happens if BLE **scan** and **connect** run at
  /// the same time. We stop the scan first, wait briefly, and use [mtu: null] on
  /// [connect] (request MTU only after services). One retry after a cool-off if the
  /// stack still returns `133`.
  Future<void> connectToDevice(BluetoothDevice device) async {
    await stopScanning();
    await Future<void>.delayed(const Duration(milliseconds: 380));

    if (!device.isConnected) {
      Future<void> doConnect() async {
        await device.connect(
          license: License.free,
          timeout: const Duration(seconds: 35),
          mtu: null,
        );
      }

      try {
        await doConnect();
      } on FlutterBluePlusException catch (e) {
        final int? c = e.code;
        if (c == 133 || c == 8 || c == 19) {
          if (kDebugMode) {
            debugPrint(
              'BLE connect failed (${e.function} code=$c), cool-off + retry…',
            );
          }
          try {
            await device.disconnect(
              queue: false,
              timeout: 12,
              androidDelay: 0,
            );
          } on Object {
            // ignore
          }
          await Future<void>.delayed(const Duration(milliseconds: 750));
          await doConnect();
        } else {
          rethrow;
        }
      }
      await Future<void>.delayed(const Duration(milliseconds: 220));
    }

    await device.discoverServices();
    try {
      await device.requestMtu(512);
    } on Object {
      // ignore
    }
    await attachMeshSyncListener(device);

    if (!kIsWeb) {
      try {
        await startScanning();
      } on Object catch (e, st) {
        if (kDebugMode) {
          debugPrint('BLE: resume scan after connect: $e\n$st');
        }
      }
    }
  }
}
