package com.example.delta

import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothGattServer
import android.bluetooth.BluetoothGattServerCallback
import android.bluetooth.BluetoothGattService
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.Context
import android.util.Log
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodChannel
import java.util.UUID

/**
 * GATT peripheral: Digital Delta service + mesh data characteristic (write + notify).
 * Centrals connect and write [SyncEnvelope] bytes; we forward to Flutter for [SyncEngine].
 */
class GattChatServer(
    private val context: Context,
    messenger: BinaryMessenger,
) {
    private val tag = "GattChatServer"
    private val channel = MethodChannel(messenger, CHANNEL)

    private var gattServer: BluetoothGattServer? = null
    private var meshDataCharacteristic: BluetoothGattCharacteristic? = null

    private val serviceUuid: UUID =
        UUID.fromString("12ab34cd-56ef-7890-1234-56789abcdef0")
    private val dataCharUuid: UUID =
        UUID.fromString("12ab34cd-56ef-7890-1234-56789abcd001")
    private val cccdUuid: UUID =
        UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")

    private val serverCallback = object : BluetoothGattServerCallback() {
        override fun onConnectionStateChange(device: BluetoothDevice, status: Int, newState: Int) {
            Log.d(tag, "conn ${device.address} state=$newState status=$status")
        }

        override fun onCharacteristicWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            gattChar: BluetoothGattCharacteristic,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray,
        ) {
            if (gattChar.uuid != dataCharUuid) {
                if (responseNeeded) {
                    gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset, null)
                }
                return
            }
            if (offset > 0) {
                if (responseNeeded) {
                    gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_INVALID_OFFSET, offset, null)
                }
                return
            }
            channel.invokeMethod("onMeshData", value)
            if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value)
            }
        }

        override fun onDescriptorReadRequest(
            device: BluetoothDevice,
            requestId: Int,
            offset: Int,
            descriptor: BluetoothGattDescriptor,
        ) {
            if (descriptor.uuid == cccdUuid) {
                gattServer?.sendResponse(
                    device,
                    requestId,
                    BluetoothGatt.GATT_SUCCESS,
                    offset,
                    BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE,
                )
            } else {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset, null)
            }
        }

        override fun onDescriptorWriteRequest(
            device: BluetoothDevice,
            requestId: Int,
            descriptor: BluetoothGattDescriptor,
            preparedWrite: Boolean,
            responseNeeded: Boolean,
            offset: Int,
            value: ByteArray,
        ) {
            if (descriptor.uuid == cccdUuid) {
                if (responseNeeded) {
                    gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_SUCCESS, offset, value)
                }
            } else if (responseNeeded) {
                gattServer?.sendResponse(device, requestId, BluetoothGatt.GATT_FAILURE, offset, null)
            }
        }
    }

    fun register() {
        channel.setMethodCallHandler { call, result ->
            when (call.method) {
                "start" -> result.success(start())
                "stop" -> {
                    stop()
                    result.success(true)
                }
                "notifyMeshData" -> {
                    val bytes = call.arguments as? ByteArray
                    if (bytes == null) {
                        result.error("BAD_ARGS", "need byte array", null)
                    } else {
                        result.success(notifySubscribers(bytes))
                    }
                }
                else -> result.notImplemented()
            }
        }
    }

    fun dispose() {
        channel.setMethodCallHandler(null)
        stop()
    }

    private fun start(): Boolean {
        if (gattServer != null) return true
        val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            ?: return false
        if (manager.adapter == null) {
            return false
        }
        gattServer = manager.openGattServer(context, serverCallback) ?: return false

        val char = BluetoothGattCharacteristic(
            dataCharUuid,
            BluetoothGattCharacteristic.PROPERTY_WRITE or
                BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE or
                BluetoothGattCharacteristic.PROPERTY_NOTIFY,
            BluetoothGattCharacteristic.PERMISSION_READ or BluetoothGattCharacteristic.PERMISSION_WRITE,
        )
        val cccd = BluetoothGattDescriptor(
            cccdUuid,
            BluetoothGattDescriptor.PERMISSION_READ or BluetoothGattDescriptor.PERMISSION_WRITE,
        )
        cccd.value = BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE
        char.addDescriptor(cccd)

        val service = BluetoothGattService(serviceUuid, BluetoothGattService.SERVICE_TYPE_PRIMARY)
        service.addCharacteristic(char)
        meshDataCharacteristic = char

        val added = gattServer!!.addService(service)
        Log.i(tag, "addService enqueued=$added")
        return true
    }

    private fun stop() {
        meshDataCharacteristic = null
        try {
            gattServer?.close()
        } catch (_: Exception) {
        }
        gattServer = null
    }

    private fun notifySubscribers(payload: ByteArray): Int {
        val server = gattServer ?: return 0
        val char = meshDataCharacteristic ?: return 0
        char.value = payload
        val mgr = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
            ?: return 0
        var n = 0
        for (device in mgr.getConnectedDevices(BluetoothProfile.GATT)) {
            if (server.notifyCharacteristicChanged(device, char, false)) {
                n++
            }
        }
        return n
    }

    companion object {
        const val CHANNEL = "com.example.delta/gatt_mesh"
    }
}
