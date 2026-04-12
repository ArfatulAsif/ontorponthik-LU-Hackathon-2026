import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../models/peer_qr_payload.dart';
import '../screens/qr_scan_flow_screen.dart';

/// Shows “my” mesh identity QR + button to scan someone else’s QR (both screens).
class PeerQrSection extends StatelessWidget {
  const PeerQrSection({
    super.key,
    required this.nodeId,
    required this.publicKeyBase64,
    this.compact = false,
  });

  final String nodeId;
  final String publicKeyBase64;
  final bool compact;

  Future<void> _openScanner(BuildContext context) async {
    final String? raw = await Navigator.of(context).push<String>(
      MaterialPageRoute<String>(
        builder: (BuildContext context) => const QrScanFlowScreen(),
      ),
    );
    if (!context.mounted || raw == null) {
      return;
    }
    final PeerQrPayload? peer = PeerQrPayload.tryParse(raw);
    if (peer == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Not a Digital Delta peer QR.'),
        ),
      );
      return;
    }
    if (peer.nodeId == nodeId) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('That QR is from this device.'),
        ),
      );
      return;
    }
    await showDialog<void>(
      context: context,
      builder: (BuildContext ctx) {
        return AlertDialog(
          title: const Text('Peer captured'),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text(
                  'You can verify this node when it appears in the BLE list, '
                  'then run sync.',
                  style: TextStyle(color: Theme.of(ctx).colorScheme.onSurfaceVariant),
                ),
                const SizedBox(height: 12),
                SelectableText(
                  peer.nodeId,
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final ColorScheme cs = Theme.of(context).colorScheme;
    final PeerQrPayload payload = PeerQrPayload(
      version: PeerQrPayload.currentVersion,
      nodeId: nodeId,
      publicKeyBase64: publicKeyBase64,
    );
    final String data = payload.encode();
    final double qrSize = compact ? 160 : 200;

    return Card(
      child: Padding(
        padding: EdgeInsets.all(compact ? 16 : 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              children: <Widget>[
                Icon(Icons.qr_code_2_rounded, color: cs.primary),
                const SizedBox(width: 8),
                Text(
                  'Peer link (QR)',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              'Share this code so others can trust your node ID before syncing over Bluetooth.',
              style: TextStyle(
                fontSize: compact ? 13 : 14,
                color: cs.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      color: cs.shadow.withValues(alpha: 0.08),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: QrImageView(
                    data: data,
                    version: QrVersions.auto,
                    size: qrSize,
                    gapless: true,
                    backgroundColor: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: () => _openScanner(context),
              icon: const Icon(Icons.qr_code_scanner_rounded),
              label: const Text('Scan peer QR'),
            ),
          ],
        ),
      ),
    );
  }
}
