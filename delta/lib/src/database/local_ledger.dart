import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

/// Singleton SQLite ledger for Digital Delta mesh state.
class LocalLedger {
  LocalLedger._();

  static final LocalLedger instance = LocalLedger._();

  static const String _dbName = 'digital_delta_ledger.db';
  static const int _dbVersion = 2;

  Database? _db;

  Future<Database> get database async {
    final existing = _db;
    if (existing != null) return existing;
    _db = await _open();
    return _db!;
  }

  Future<Database> _open() async {
    final dir = await getApplicationDocumentsDirectory();
    final path = '${dir.path}/$_dbName';
    return openDatabase(
      path,
      version: _dbVersion,
      onCreate: (Database db, int version) async {
        await _createV1Tables(db);
        await _createCrdtCountersTable(db);
      },
      onUpgrade: (Database db, int oldVersion, int newVersion) async {
        if (oldVersion < 2) {
          await _createCrdtCountersTable(db);
        }
      },
    );
  }

  Future<void> _createV1Tables(Database db) async {
    await db.execute('''
CREATE TABLE known_nodes (
  node_id TEXT PRIMARY KEY NOT NULL,
  public_key_base64 TEXT NOT NULL,
  role INTEGER NOT NULL,
  trust_level TEXT NOT NULL
);
''');
    await db.execute('''
CREATE TABLE vector_clocks (
  node_id TEXT PRIMARY KEY NOT NULL,
  tick INTEGER NOT NULL
);
''');
  }

  Future<void> _createCrdtCountersTable(Database db) async {
    await db.execute('''
CREATE TABLE IF NOT EXISTS crdt_counters (
  node_id TEXT PRIMARY KEY NOT NULL,
  count INTEGER NOT NULL
);
''');
  }

  /// Insert or replace a row in [known_nodes].
  Future<void> upsertNode(
    String nodeId,
    String pubKeyBase64,
    int role,
    String trustLevel,
  ) async {
    final db = await database;
    await db.insert(
      'known_nodes',
      <String, Object?>{
        'node_id': nodeId,
        'public_key_base64': pubKeyBase64,
        'role': role,
        'trust_level': trustLevel,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Returns a single node row, or `null` if absent.
  Future<KnownNodeRecord?> getNode(String nodeId) async {
    final db = await database;
    final rows = await db.query(
      'known_nodes',
      where: 'node_id = ?',
      whereArgs: <Object>[nodeId],
      limit: 1,
    );
    if (rows.isEmpty) return null;
    return KnownNodeRecord.fromMap(rows.first);
  }

  /// All [node_id] values currently in the ledger.
  Future<List<String>> listKnownNodeIds() async {
    final db = await database;
    final rows = await db.query('known_nodes', columns: <String>['node_id']);
    return rows.map((m) => m['node_id']! as String).toList();
  }

  /// Full mesh vector clock snapshot.
  Future<Map<String, int>> getAllVectorClocks() async {
    final db = await database;
    final rows = await db.query('vector_clocks');
    final out = <String, int>{};
    for (final row in rows) {
      out[row['node_id']! as String] = row['tick']! as int;
    }
    return out;
  }

  /// Upserts a logical clock tick for [nodeId].
  Future<void> upsertVectorClock(String nodeId, int tick) async {
    final db = await database;
    await db.insert(
      'vector_clocks',
      <String, Object?>{
        'node_id': nodeId,
        'tick': tick,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// G-Counter partial counts per [node_id] (CRDT state).
  Future<Map<String, int>> getAllCounts() async {
    final db = await database;
    final List<Map<String, Object?>> rows =
        await db.query('crdt_counters');
    final Map<String, int> out = <String, int>{};
    for (final Map<String, Object?> row in rows) {
      out[row['node_id']! as String] = row['count']! as int;
    }
    return out;
  }

  /// Upserts one node's partial count in the G-Counter table.
  Future<void> upsertCount(String nodeId, int count) async {
    final db = await database;
    await db.insert(
      'crdt_counters',
      <String, Object?>{
        'node_id': nodeId,
        'count': count,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }
}

class KnownNodeRecord {
  const KnownNodeRecord({
    required this.nodeId,
    required this.publicKeyBase64,
    required this.role,
    required this.trustLevel,
  });

  final String nodeId;
  final String publicKeyBase64;
  final int role;
  final String trustLevel;

  factory KnownNodeRecord.fromMap(Map<String, Object?> map) {
    return KnownNodeRecord(
      nodeId: map['node_id']! as String,
      publicKeyBase64: map['public_key_base64']! as String,
      role: map['role']! as int,
      trustLevel: map['trust_level']! as String,
    );
  }
}
