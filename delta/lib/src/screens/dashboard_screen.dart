import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart' show defaultTargetPlatform;
import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';

import '../ble/mesh_presence_codec.dart';
import '../services/ble_mesh_service.dart';
import '../services/identity_service.dart';
import '../services/sync_engine.dart';
import '../widgets/peer_qr_section.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String? _nodeId;
  String? _publicKeyB64;
  String _profileDisplayName = 'Peer';
  int _profileRoleValue = 1;
  bool _identityLoading = true;
  Object? _identityError;
  bool? _meshAdvertising;

  int _resourceTotal = 0;
  List<int>? _pendingResourceSyncBytes;
  bool _resourceBusy = false;
  StreamSubscription<void>? _resourceCounterSub;

  @override
  void initState() {
    super.initState();
    _resourceCounterSub = SyncEngine.resourceCounterChanged.stream.listen((_) {
      _refreshResourceTotal();
    });
    _boot();
  }

  Future<void> _boot() async {
    await _loadIdentity();
    if (!mounted || _identityError != null) {
      return;
    }
    await _refreshResourceTotal();
    await _startBleMesh();
  }

  Future<void> _refreshResourceTotal() async {
    final int t = await SyncEngine().getResourceDistributedTotal();
    if (!mounted) {
      return;
    }
    setState(() => _resourceTotal = t);
  }

  Future<void> _onAddResource() async {
    final String? nid = _nodeId;
    final String? pk = _publicKeyB64;
    if (nid == null || pk == null || _resourceBusy) {
      return;
    }
    setState(() => _resourceBusy = true);
    try {
      final SyncEngine sync = SyncEngine();
      final int sum = await sync.incrementResourceCounter(nid);
      final List<int> bytes = await sync.buildResourceCounterSyncBuffer(
        nid,
        base64Decode(pk),
      );
      int peerCount =
          await BleMeshService.instance.writeResourceCounterToConnectedPeers(bytes);
      if (peerCount == 0) {
        peerCount =
            await BleMeshService.instance.broadcastResourceCounterSync(bytes);
      }
      if (!mounted) {
        return;
      }
      setState(() {
        _resourceTotal = sum;
        _pendingResourceSyncBytes = bytes;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            peerCount == 0
                ? 'G-Counter $sum saved locally. Tap Sync on a peer (stay connected), '
                    'then +1 again — or ensure the peer appears in scan.'
                : 'G-Counter $sum — sent to $peerCount peer(s) (connected and/or scan).',
          ),
        ),
      );
    } on Object catch (e) {
      if (!mounted) {
        return;
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Could not update counter: $e')),
      );
    } finally {
      if (mounted) {
        setState(() => _resourceBusy = false);
      }
    }
  }

  Future<void> _loadIdentity() async {
    try {
      final IdentityService ids = IdentityService();
      final IdentityBootstrapResult r = await ids.bootstrap();
      final String? name = await ids.readDisplayName();
      final int role = await ids.roleForNode(r.nodeId);
      if (!mounted) return;
      setState(() {
        _nodeId = r.nodeId;
        _publicKeyB64 = r.publicKeyBase64;
        _profileDisplayName = name ?? 'Peer';
        _profileRoleValue = role;
        _identityLoading = false;
        _identityError = null;
      });
    } on Object catch (e) {
      if (!mounted) return;
      setState(() {
        _identityError = e;
        _identityLoading = false;
      });
    }
  }

  /// Scan (central) + advertise (peripheral) so peers can find each other.
  Future<void> _startBleMesh() async {
    try {
      final bool advertising =
          await BleMeshService.instance.startMeshSession(
        roleValue: _profileRoleValue,
        displayName: _profileDisplayName,
      );
      if (!mounted) return;
      setState(() => _meshAdvertising = advertising);
      if (!advertising) {
        final bool permanentDeny = defaultTargetPlatform == TargetPlatform.android &&
            await Permission.bluetoothAdvertise.isPermanentlyDenied;
        if (permanentDeny && mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text(
                'Bluetooth advertising is blocked. Enable it in Settings → App → '
                'Permissions (Android 12+: Nearby devices / Bluetooth).',
              ),
              action: SnackBarAction(
                label: 'Settings',
                onPressed: openAppSettings,
              ),
            ),
          );
        }
      }
    } on Object catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Bluetooth mesh error: $e',
          ),
          duration: const Duration(seconds: 6),
        ),
      );
    }
  }

  @override
  void dispose() {
    _resourceCounterSub?.cancel();
    BleMeshService.instance.disposeMeshSyncListeners();
    BleMeshService.instance.stopAdvertisingMeshPresence();
    BleMeshService.instance.stopScanning();
    super.dispose();
  }

  Future<void> _onSync(BluetoothDevice device) async {
    try {
      await BleMeshService.instance.connectToDevice(device);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Triggering SyncEngine Handshake...'),
        ),
      );
    } on Object catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Connection failed: $e')),
      );
    }
  }

  Widget _buildHeader(ColorScheme cs) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.only(
        top: MediaQuery.paddingOf(context).top + 16,
        left: 20,
        right: 20,
        bottom: 20,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: <Color>[
            cs.primaryContainer,
            cs.secondaryContainer,
          ],
        ),
        borderRadius: const BorderRadius.vertical(
          bottom: Radius.circular(28),
        ),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: cs.primary.withValues(alpha: 0.12),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(Icons.hub_rounded, color: cs.onPrimaryContainer),
              const SizedBox(width: 10),
              Text(
                'Digital Delta',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: cs.onPrimaryContainer,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Offline-first disaster response mesh',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: cs.onPrimaryContainer.withValues(alpha: 0.85),
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildIdentityCard(ColorScheme cs) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Card(
        clipBehavior: Clip.antiAlias,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: <Color>[
                cs.surfaceContainerHighest,
                cs.surface,
              ],
            ),
          ),
          padding: const EdgeInsets.all(20),
          child: _identityLoading
              ? Row(
                  children: <Widget>[
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: cs.primary,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Text(
                      'Loading your node ID…',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ],
                )
              : _identityError != null
                  ? Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Icon(Icons.error_outline, color: cs.error),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Identity error: $_identityError',
                            style: TextStyle(color: cs.error),
                          ),
                        ),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Icon(
                              Icons.verified_user_rounded,
                              color: cs.primary,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Your node ID',
                              style: Theme.of(context)
                                  .textTheme
                                  .labelLarge
                                  ?.copyWith(
                                    color: cs.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        SelectableText(
                          _nodeId ?? '—',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                fontFamily: 'monospace',
                                letterSpacing: 0.2,
                              ),
                        ),
                      ],
                    ),
        ),
      ),
    );
  }

  Widget _buildResourceDistributedCard(ColorScheme cs) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: Card(
        elevation: 3,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
          child: Row(
            children: <Widget>[
              DecoratedBox(
                decoration: BoxDecoration(
                  color: cs.primaryContainer,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Icon(
                    Icons.analytics_outlined,
                    size: 32,
                    color: cs.onPrimaryContainer,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Total Resources Distributed',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '$_resourceTotal',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: cs.primary,
                            fontFamily: 'monospace',
                          ),
                    ),
                    if (_pendingResourceSyncBytes != null) ...<Widget>[
                      const SizedBox(height: 6),
                      Text(
                        'Latest sync payload: ${_pendingResourceSyncBytes!.length} bytes (BLE)',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: cs.onSurfaceVariant,
                            ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChipsSection(ColorScheme cs) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[
          Row(
            children: <Widget>[
              Icon(Icons.bluetooth_searching_rounded, color: cs.secondary),
              const SizedBox(width: 8),
              Text(
                'Nearby mesh devices',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: <Widget>[
              Chip(
                avatar: Icon(Icons.radar, size: 18, color: cs.primary),
                label: const Text('Scanning for service UUID'),
              ),
              Chip(
                avatar: Icon(
                  _meshAdvertising == true
                      ? Icons.podcasts
                      : Icons.warning_amber_rounded,
                  size: 18,
                  color: _meshAdvertising == true ? cs.tertiary : cs.error,
                ),
                label: Text(
                  _meshAdvertising == true
                      ? 'You are advertising (discoverable)'
                      : _meshAdvertising == false
                          ? 'Not advertising — peers may not find you'
                          : 'Advertising status…',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme cs = Theme.of(context).colorScheme;
    final bool showQr = !_identityLoading &&
        _identityError == null &&
        _nodeId != null &&
        _publicKeyB64 != null;

    return Scaffold(
      floatingActionButton: _identityLoading || _identityError != null || _nodeId == null
          ? null
          : FloatingActionButton.extended(
              onPressed: _resourceBusy ? null : _onAddResource,
              icon: _resourceBusy
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.add_rounded),
              label: Text(_resourceBusy ? 'Updating…' : '+1 Resource'),
            ),
      body: CustomScrollView(
        slivers: <Widget>[
          SliverToBoxAdapter(child: _buildHeader(cs)),
          SliverToBoxAdapter(child: _buildIdentityCard(cs)),
          if (!_identityLoading && _identityError == null)
            SliverToBoxAdapter(child: _buildResourceDistributedCard(cs)),
          if (showQr)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: PeerQrSection(
                  nodeId: _nodeId!,
                  publicKeyBase64: _publicKeyB64!,
                ),
              ),
            ),
          SliverToBoxAdapter(child: _buildChipsSection(cs)),
          SliverToBoxAdapter(
            child: StreamBuilder<List<ScanResult>>(
              stream: BleMeshService.instance.discoveredDevices,
              initialData: FlutterBluePlus.lastScanResults,
              builder: (BuildContext context,
                  AsyncSnapshot<List<ScanResult>> snap) {
                final List<ScanResult> results =
                    snap.data ?? const <ScanResult>[];
                if (results.isEmpty) {
                  return Padding(
                    padding: const EdgeInsets.fromLTRB(32, 16, 32, 32),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        Icon(
                          Icons.devices_other_rounded,
                          size: 56,
                          color: cs.outline,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No mesh peers yet',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Each phone must run this app and broadcast the same '
                          'BLE service. Classic Bluetooth pairing does not help. '
                          'Open Digital Delta on the other device and keep this screen visible.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: cs.onSurfaceVariant),
                        ),
                      ],
                    ),
                  );
                }
                return Padding(
                  padding: const EdgeInsets.fromLTRB(12, 0, 12, 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      for (int i = 0; i < results.length; i++)
                        _buildPeerTile(context, cs, results[i]),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeerTile(
    BuildContext context,
    ColorScheme cs,
    ScanResult sr,
  ) {
    final BluetoothDevice d = sr.device;
    final MeshPresence? presence =
        MeshPresenceCodec.decode(sr.advertisementData);
    final String titleText = presence?.displayName ??
        (d.advName.isNotEmpty
            ? d.advName
            : (d.platformName.isNotEmpty ? d.platformName : 'Mesh peer'));
    final String roleLine = presence != null
        ? MeshPresenceCodec.roleLabel(presence.roleValue)
        : 'Role unknown (update peer app)';
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Material(
        color: cs.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        child: ListTile(
          isThreeLine: true,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 4,
          ),
          leading: CircleAvatar(
            backgroundColor: cs.secondaryContainer.withValues(alpha: 0.9),
            child: Icon(
              Icons.bluetooth_rounded,
              color: cs.onSecondaryContainer,
            ),
          ),
          title: Text(
            titleText,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text(
                roleLine,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: cs.primary,
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 4),
              Text(
                d.remoteId.str,
                style: Theme.of(context)
                    .textTheme
                    .bodySmall
                    ?.copyWith(fontFamily: 'monospace'),
              ),
            ],
          ),
          trailing: FilledButton.tonal(
            onPressed: () => _onSync(d),
            style: FilledButton.styleFrom(
              backgroundColor: cs.primaryContainer,
              foregroundColor: cs.onPrimaryContainer,
            ),
            child: const Text('Sync'),
          ),
        ),
      ),
    );
  }
}
