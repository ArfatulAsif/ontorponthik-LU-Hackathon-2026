package com.example.delta

import android.Manifest
import android.app.Activity
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import android.util.Log
import androidx.core.content.ContextCompat
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import java.util.UUID

/**
 * Debug-only BLE advertiser using the platform [BluetoothLeAdvertiser] API directly.
 * Logs [AdvertiseCallback.onStartFailure] codes with SIG names — use logcat:
 *   adb logcat -s DeltaBleAdvertiser:D
 */
class BleAdvertiserDebugChannel(
    private val activity: Activity,
) : MethodChannel.MethodCallHandler {

    private val tag = "DeltaBleAdvertiser"
    private var channel: MethodChannel? = null
    private var advertiser: BluetoothLeAdvertiser? = null
    private var activeCallback: AdvertiseCallback? = null

    fun register(messenger: io.flutter.plugin.common.BinaryMessenger) {
        channel = MethodChannel(messenger, CHANNEL_NAME).also { it.setMethodCallHandler(this) }
    }

    fun dispose() {
        stopAdvertisingInternal(silent = true)
        channel?.setMethodCallHandler(null)
        channel = null
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "diagnostics" -> result.success(collectDiagnostics(activity))
            "startAdvertising" -> {
                val uuidStr = call.argument<String>("serviceUuid")
                if (uuidStr.isNullOrBlank()) {
                    result.error("BAD_ARGS", "serviceUuid required", null)
                    return
                }
                startAdvertising(uuidStr, result)
            }
            "stopAdvertising" -> {
                stopAdvertisingInternal(silent = false)
                result.success(mapOf("ok" to true))
            }
            else -> result.notImplemented()
        }
    }

    private fun collectDiagnostics(context: Context): Map<String, Any?> {
        val pm = context.packageManager
        val hasLeFeature = pm.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)
        val bm = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
        val adapter = bm?.adapter
        val adv = adapter?.bluetoothLeAdvertiser

        val map = mutableMapOf<String, Any?>(
            "sdkInt" to Build.VERSION.SDK_INT,
            "FEATURE_BLUETOOTH_LE" to hasLeFeature,
            "adapter_null" to (adapter == null),
            "advertiser_null" to (adv == null),
            "bt_enabled" to (adapter?.isEnabled == true),
            "isMultipleAdvertisementSupported" to (adapter?.isMultipleAdvertisementSupported == true),
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && adapter != null) {
            map["isLeExtendedAdvertisingSupported"] = adapter.isLeExtendedAdvertisingSupported
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            map["permission_BLUETOOTH_ADVERTISE"] =
                ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_ADVERTISE) ==
                    PackageManager.PERMISSION_GRANTED
            map["permission_BLUETOOTH_CONNECT"] =
                ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT) ==
                    PackageManager.PERMISSION_GRANTED
        }
        return map
    }

    private fun startAdvertising(uuidStr: String, result: MethodChannel.Result) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val okAdv = ContextCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_ADVERTISE) ==
                PackageManager.PERMISSION_GRANTED
            val okConn = ContextCompat.checkSelfPermission(activity, Manifest.permission.BLUETOOTH_CONNECT) ==
                PackageManager.PERMISSION_GRANTED
            if (!okAdv || !okConn) {
                Log.e(tag, "startAdvertising: missing permission advertise=$okAdv connect=$okConn")
                result.error(
                    "PERMISSION",
                    "Need BLUETOOTH_ADVERTISE and BLUETOOTH_CONNECT",
                    mapOf("bluetooth_advertise" to okAdv, "bluetooth_connect" to okConn),
                )
                return
            }
        }

        val bm = activity.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
        val adapter = bm?.adapter
        if (adapter == null || !adapter.isEnabled) {
            Log.e(tag, "startAdvertising: adapter null or disabled")
            result.error("ADAPTER", "Bluetooth adapter off or missing", null)
            return
        }

        advertiser = adapter.bluetoothLeAdvertiser
        if (advertiser == null) {
            Log.e(tag, "startAdvertising: bluetoothLeAdvertiser is NULL (no LE advertising hardware/driver)")
            result.error(
                "NO_ADVERTISER",
                "bluetoothLeAdvertiser returned null — OEM may not expose a LE advertiser",
                collectDiagnostics(activity),
            )
            return
        }

        stopAdvertisingInternal(silent = true)

        val uuid: UUID = try {
            UUID.fromString(uuidStr)
        } catch (e: IllegalArgumentException) {
            result.error("BAD_UUID", e.message, null)
            return
        }

        val data = AdvertiseData.Builder()
            .addServiceUuid(ParcelUuid(uuid))
            .setIncludeDeviceName(false)
            .build()

        val settings = AdvertiseSettings.Builder()
            .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
            .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
            .setConnectable(true)
            .setTimeout(0)
            .build()

        Log.i(
            tag,
            "startAdvertising: uuid=$uuidStr mode=LOW_LATENCY tx=HIGH connectable=true " +
                "multiAdv=${adapter.isMultipleAdvertisementSupported}",
        )

        val callback = object : AdvertiseCallback() {
            override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {
                Log.i(
                    tag,
                    "onStartSuccess: mode=${settingsInEffect.mode} txPower=${settingsInEffect.txPowerLevel} timeout=${settingsInEffect.timeout}",
                )
                activeCallback = this
                result.success(
                    mapOf(
                        "ok" to true,
                        "mode" to settingsInEffect.mode,
                        "txPowerLevel" to settingsInEffect.txPowerLevel,
                    ),
                )
            }

            override fun onStartFailure(errorCode: Int) {
                val name = advertiseFailureName(errorCode)
                Log.e(tag, "onStartFailure: code=$errorCode ($name)")
                result.error(
                    name,
                    "AdvertiseCallback.onStartFailure: $errorCode",
                    mapOf(
                        "errorCode" to errorCode,
                        "errorName" to name,
                        "diagnostics" to collectDiagnostics(activity),
                    ),
                )
            }
        }

        activeCallback = callback
        try {
            advertiser!!.startAdvertising(settings, data, callback)
        } catch (t: Throwable) {
            Log.e(tag, "startAdvertising threw", t)
            result.error("EXCEPTION", t.message, mapOf("type" to t.javaClass.name))
        }
    }

    private fun stopAdvertisingInternal(silent: Boolean) {
        val adv = advertiser
        val cb = activeCallback
        if (adv != null && cb != null) {
            try {
                adv.stopAdvertising(cb)
                Log.i(tag, "stopAdvertising: stopped")
            } catch (t: Throwable) {
                if (!silent) Log.w(tag, "stopAdvertising", t)
            }
        }
        activeCallback = null
    }

    private fun advertiseFailureName(code: Int): String = when (code) {
        AdvertiseCallback.ADVERTISE_FAILED_DATA_TOO_LARGE -> "ADVERTISE_FAILED_DATA_TOO_LARGE"
        AdvertiseCallback.ADVERTISE_FAILED_TOO_MANY_ADVERTISERS -> "ADVERTISE_FAILED_TOO_MANY_ADVERTISERS"
        AdvertiseCallback.ADVERTISE_FAILED_ALREADY_STARTED -> "ADVERTISE_FAILED_ALREADY_STARTED"
        AdvertiseCallback.ADVERTISE_FAILED_INTERNAL_ERROR -> "ADVERTISE_FAILED_INTERNAL_ERROR"
        AdvertiseCallback.ADVERTISE_FAILED_FEATURE_UNSUPPORTED -> "ADVERTISE_FAILED_FEATURE_UNSUPPORTED"
        else -> "ADVERTISE_FAILED_UNKNOWN_$code"
    }

    companion object {
        const val CHANNEL_NAME = "com.example.delta/ble_advertiser_debug"
    }
}
