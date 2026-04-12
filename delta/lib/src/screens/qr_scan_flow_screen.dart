import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import 'qr_scanner_screen.dart';

/// Opens before the live scanner: explains why we need the camera, then runs
/// [Permission.camera.request()] from an explicit button (system permission sheet).
class QrScanFlowScreen extends StatefulWidget {
  const QrScanFlowScreen({super.key});

  @override
  State<QrScanFlowScreen> createState() => _QrScanFlowScreenState();
}

class _QrScanFlowScreenState extends State<QrScanFlowScreen> {
  bool _checking = true;
  bool _openingScanner = false;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final PermissionStatus s = await Permission.camera.status;
    if (!mounted) {
      return;
    }
    if (s.isGranted) {
      await _goToScanner();
      return;
    }
    setState(() => _checking = false);
  }

  Future<void> _goToScanner() async {
    if (_openingScanner) {
      return;
    }
    setState(() => _openingScanner = true);
    final String? raw = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(
        builder: (BuildContext context) => const QrScannerScreen(),
      ),
    );
    if (!mounted) {
      return;
    }
    Navigator.of(context).pop<String>(raw);
  }

  Future<void> _onAllowCamera() async {
    final PermissionStatus s = await Permission.camera.request();
    if (!mounted) {
      return;
    }
    if (s.isGranted) {
      await _goToScanner();
      return;
    }
    if (s.isPermanentlyDenied) {
      await showDialog<void>(
        context: context,
        builder: (BuildContext ctx) {
          return AlertDialog(
            title: const Text('Camera blocked'),
            content: const Text(
              'Enable Camera for Digital Delta in system Settings, then try again.',
            ),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () {
                  Navigator.of(ctx).pop();
                  openAppSettings();
                },
                child: const Text('Open Settings'),
              ),
            ],
          );
        },
      );
      return;
    }
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Camera permission is required to scan a QR code.'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme cs = Theme.of(context).colorScheme;

    if (_checking || _openingScanner) {
      return Scaffold(
        appBar: AppBar(title: const Text('Scan peer QR')),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Camera permission'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              const SizedBox(height: 8),
              Icon(
                Icons.photo_camera_outlined,
                size: 72,
                color: cs.primary,
              ),
              const SizedBox(height: 24),
              Text(
                'Scan a peer QR',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Text(
                'Digital Delta uses the camera only to read the other device’s QR '
                'code. Nothing is uploaded.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: cs.onSurfaceVariant,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'If “Camera” is not listed under App permissions yet, tap '
                '“Allow camera access” below first — many phones only show it '
                'after the system prompt.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12,
                  color: cs.onSurfaceVariant.withValues(alpha: 0.95),
                  height: 1.35,
                ),
              ),
              const Spacer(),
              FilledButton.icon(
                onPressed: _onAllowCamera,
                icon: const Icon(Icons.privacy_tip_outlined),
                label: const Text('Allow camera access'),
              ),
              const SizedBox(height: 8),
              TextButton.icon(
                onPressed: openAppSettings,
                icon: const Icon(Icons.settings_outlined, size: 20),
                label: const Text('Open app settings (find Camera manually)'),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => Navigator.of(context).pop<String>(null),
                child: const Text('Cancel'),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }
}
