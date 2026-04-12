import 'package:flutter/services.dart';

/// Native [BluetoothLeAdvertiser] debug channel — bypasses `flutter_ble_peripheral`.
/// Use with logcat: `adb logcat -s DeltaBleAdvertiser:D`
class BleAdvertiserDebugChannel {
  BleAdvertiserDebugChannel._();

  static const MethodChannel _channel = MethodChannel(
    'com.example.delta/ble_advertiser_debug',
  );

  /// Radio / adapter / permission snapshot (Kotlin [collectDiagnostics]).
  static Future<Map<String, Object?>> diagnostics() async {
    final Object? raw = await _channel.invokeMethod<Object>('diagnostics');
    if (raw is Map) {
      return raw.map((k, v) => MapEntry(k.toString(), _cast(v)));
    }
    return <String, Object?>{};
  }

  /// Starts legacy `startAdvertising` with a single 128-bit service UUID in AD.
  /// Success: `{ ok: true, mode, txPowerLevel }`.
  /// Failure: [PlatformException] with `code` = e.g. `ADVERTISE_FAILED_INTERNAL_ERROR`.
  static Future<Map<String, Object?>> startAdvertising(String serviceUuid) async {
    final Object? raw = await _channel.invokeMethod<Object>(
      'startAdvertising',
      <String, String>{'serviceUuid': serviceUuid},
    );
    if (raw is Map) {
      return raw.map((k, v) => MapEntry(k.toString(), _cast(v)));
    }
    return <String, Object?>{};
  }

  static Future<void> stopAdvertising() async {
    await _channel.invokeMethod<void>('stopAdvertising');
  }

  static Object? _cast(Object? v) {
    if (v is Map) {
      return v.map((k, val) => MapEntry(k.toString(), _cast(val)));
    }
    return v;
  }
}
