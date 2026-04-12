package com.example.delta

import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {

    private var bleAdvertiserDebug: BleAdvertiserDebugChannel? = null
    private var gattMeshServer: GattChatServer? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        bleAdvertiserDebug = BleAdvertiserDebugChannel(this).also {
            it.register(flutterEngine.dartExecutor.binaryMessenger)
        }
        gattMeshServer = GattChatServer(this, flutterEngine.dartExecutor.binaryMessenger).also {
            it.register()
        }
    }

    override fun onDestroy() {
        gattMeshServer?.dispose()
        gattMeshServer = null
        bleAdvertiserDebug?.dispose()
        bleAdvertiserDebug = null
        super.onDestroy()
    }
}
