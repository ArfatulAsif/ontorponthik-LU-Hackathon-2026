import 'dart:async';
import 'dart:convert';

import '../database/local_ledger.dart';
import '../generated/digitaldelta.pb.dart' as pb;

/// Anti-entropy and inbound sync helpers for the gossip mesh.
class SyncEngine {
  SyncEngine({LocalLedger? ledger}) : _ledger = ledger ?? LocalLedger.instance;

  final LocalLedger _ledger;

  /// Fires after local G-Counter state changes (increment, merge, or inbound BLE sync).
  static final StreamController<void> resourceCounterChanged =
      StreamController<void>.broadcast();

  void _emitResourceCounterChanged() {
    resourceCounterChanged.add(null);
  }

  /// Handshake payload: our view of the mesh vector clock.
  Future<Map<String, int>> generateHandshake() async {
    return _ledger.getAllVectorClocks();
  }

  /// Compares [peerClock] with our [known_nodes].
  ///
  /// Returns node IDs we have locally where the peer's clock is `0` or missing
  /// (treated as `0`). Callers can later wrap these records in [pb.SyncEnvelope].
  Future<List<String>> processPeerHandshake(Map<String, int> peerClock) async {
    final List<String> known = await _ledger.listKnownNodeIds();
    final List<String> missingAtPeer = <String>[];
    for (final String id in known) {
      final int? t = peerClock[id];
      if (t == null || t == 0) {
        missingAtPeer.add(id);
      }
    }
    return missingAtPeer;
  }

  /// Increments this device's partial count in the G-Counter and persists SQLite.
  ///
  /// Returns the new **global** sum (sum of all nodes' partial counts).
  Future<int> incrementResourceCounter(String myNodeId) async {
    final Map<String, int> m = await _ledger.getAllCounts();
    final int cur = m[myNodeId] ?? 0;
    await _ledger.upsertCount(myNodeId, cur + 1);
    _emitResourceCounterChanged();
    return getCRDTSum(await _ledger.getAllCounts());
  }

  /// Sum of all partial counts — total resources distributed across the mesh.
  int getCRDTSum(Map<String, int> counterMap) {
    int s = 0;
    for (final int v in counterMap.values) {
      s += v;
    }
    return s;
  }

  /// LWW merge for G-Counter: per [node_id], keep [max(local, incoming)].
  Future<void> mergeIncomingGCounter(Map<String, int> incomingCounter) async {
    final Map<String, int> local = await _ledger.getAllCounts();
    for (final MapEntry<String, int> e in incomingCounter.entries) {
      final int a = local[e.key] ?? 0;
      final int b = e.value;
      await _ledger.upsertCount(e.key, a > b ? a : b);
    }
  }

  /// Current total from persisted CRDT state.
  Future<int> getResourceDistributedTotal() async {
    return getCRDTSum(await _ledger.getAllCounts());
  }

  /// Serialized [pb.SyncEnvelope] with [resourceCounter] set (for BLE gossip).
  ///
  /// [senderPublicKeyBytes] is the raw Ed25519 public key bytes (not Base64).
  Future<List<int>> buildResourceCounterSyncBuffer(
    String senderNodeId,
    List<int> senderPublicKeyBytes,
  ) async {
    final Map<String, int> counts = await _ledger.getAllCounts();
    final pb.GCounter gc = pb.GCounter();
    gc.increments.addAll(counts);
    final pb.SyncEnvelope envelope = pb.SyncEnvelope(
      senderNodeId: senderNodeId,
      senderPublicKey: senderPublicKeyBytes,
      resourceCounter: gc,
    );
    return envelope.writeToBuffer();
  }

  /// Decodes a serialized [pb.SyncEnvelope] and applies supported payloads.
  Future<void> handleIncomingSync(List<int> buffer) async {
    final pb.SyncEnvelope envelope = pb.SyncEnvelope.fromBuffer(buffer);
    if (envelope.hasResourceCounter()) {
      final Map<String, int> incoming = Map<String, int>.from(
        envelope.resourceCounter.increments,
      );
      await mergeIncomingGCounter(incoming);
      _emitResourceCounterChanged();
    }
    if (envelope.whichPayload() == pb.SyncEnvelope_Payload.registration) {
      final pb.UserIdentity id = envelope.registration;
      if (!id.hasNodeId() || !id.hasPublicKey() || id.publicKey.isEmpty) {
        return;
      }
      final String pubB64 = base64Encode(id.publicKey);
      final int role = id.hasRole() ? id.role.value : 0;
      await _ledger.upsertNode(
        id.nodeId,
        pubB64,
        role,
        'PEER',
      );
    }
  }
}
