import 'dart:convert';

/// Compact JSON inside QR codes: peer [nodeId] + Ed25519 public key for trust bootstrap.
class PeerQrPayload {
  const PeerQrPayload({
    required this.version,
    required this.nodeId,
    required this.publicKeyBase64,
  });

  static const int currentVersion = 1;

  final int version;
  final String nodeId;
  final String publicKeyBase64;

  Map<String, dynamic> toJson() => <String, dynamic>{
        'v': version,
        'nid': nodeId,
        'pk': publicKeyBase64,
      };

  factory PeerQrPayload.fromJson(Map<String, dynamic> json) {
    final int v = json['v'] as int? ?? 1;
    if (v != currentVersion) {
      throw FormatException('Unsupported QR version: $v');
    }
    final String? nid = json['nid'] as String?;
    final String? pk = json['pk'] as String?;
    if (nid == null || nid.isEmpty) {
      throw FormatException('Missing node id (nid)');
    }
    if (pk == null || pk.isEmpty) {
      throw FormatException('Missing public key (pk)');
    }
    return PeerQrPayload(version: v, nodeId: nid, publicKeyBase64: pk);
  }

  String encode() => jsonEncode(toJson());

  static PeerQrPayload? tryParse(String raw) {
    final String trimmed = raw.trim();
    if (trimmed.isEmpty) {
      return null;
    }
    try {
      final Object? decoded = jsonDecode(trimmed);
      if (decoded is! Map<String, dynamic>) {
        return null;
      }
      return PeerQrPayload.fromJson(decoded);
    } on Object {
      return null;
    }
  }
}
