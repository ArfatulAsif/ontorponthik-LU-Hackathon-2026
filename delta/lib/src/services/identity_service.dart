import 'dart:convert';

import 'package:cryptography/cryptography.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:otp/otp.dart';

import '../database/local_ledger.dart';

const _kPrivateKeyStorageKey = 'private_key';

/// Secure storage key for profile display name (set during onboarding).
const String kDisplayNameStorageKey = 'display_name';

/// Default on-device role: [Role.FIELD_VOLUNTEER] in protobuf (`FIELD_VOLUNTEER = 1`).
const int kDefaultBootstrapRole = 1;

/// Hackathon prototype: shared Base32 secret (RFC 4648) for offline TOTP.
/// Compatible with standard authenticator apps (SHA-1, 30s step).
const String commandCenterSecret = 'JBSWY3DPEHPK3PXP';

/// Thrown when [verifyVolunteerOtp] rejects the code or input is malformed.
class IdentityVerificationException implements Exception {
  IdentityVerificationException(this.message);

  final String message;

  @override
  String toString() => message;
}

/// No Ed25519 key on device yet — finish Command Center authorization and onboarding.
class IdentityNotReadyException implements Exception {
  IdentityNotReadyException(this.message);

  final String message;

  @override
  String toString() => message;
}

/// Result of [IdentityService.bootstrap] / [IdentityService.createIdentityAfterOtpVerification].
class IdentityBootstrapResult {
  const IdentityBootstrapResult({
    required this.nodeId,
    required this.publicKeyBase64,
    required this.createdNewIdentity,
  });

  /// SHA-256(public key) as lowercase hex (stable [node_id]).
  final String nodeId;

  /// Raw Ed25519 public key, Base64-encoded.
  final String publicKeyBase64;

  /// `true` if a new key pair was generated this run.
  final bool createdNewIdentity;
}

/// Loads or creates the device Ed25519 identity and mirrors self into [LocalLedger].
class IdentityService {
  IdentityService({
    FlutterSecureStorage? secureStorage,
    LocalLedger? ledger,
    Ed25519? ed25519,
  })  : _storage = secureStorage ?? const FlutterSecureStorage(),
        _ledger = ledger ?? LocalLedger.instance,
        _ed25519 = ed25519 ?? Ed25519();

  final FlutterSecureStorage _storage;
  final LocalLedger _ledger;
  final Ed25519 _ed25519;

  /// Call once on startup when an identity is expected (e.g. [DashboardScreen]).
  ///
  /// Does **not** create keys without prior offline TOTP verification — use
  /// [verifyVolunteerOtp] then [createIdentityAfterOtpVerification] during onboarding.
  Future<IdentityBootstrapResult> bootstrap() async {
    final String? existing = await _storage.read(key: _kPrivateKeyStorageKey);
    if (existing == null || existing.isEmpty) {
      throw IdentityNotReadyException(
        'No identity on this device. Complete Command Center authorization first.',
      );
    }
    return _loadExistingIdentity(existing);
  }

  /// Validates [userEnteredCode] against the current TOTP derived from [commandCenterSecret].
  ///
  /// Uses RFC 6238-style TOTP (SHA-1, 30s window, 6 digits, Google Authenticator–compatible
  /// secret handling). Allows ±1 interval for clock skew.
  ///
  /// Throws [IdentityVerificationException] if the code is invalid.
  void verifyVolunteerOtp(String userEnteredCode) {
    final String normalized =
        userEnteredCode.trim().replaceAll(RegExp(r'\s+'), '');
    if (!RegExp(r'^\d{6}$').hasMatch(normalized)) {
      throw IdentityVerificationException(
        'Enter a valid 6-digit Command Center authorization code.',
      );
    }
    final int now = DateTime.now().millisecondsSinceEpoch;
    for (int w = -1; w <= 1; w++) {
      final String expected = OTP.generateTOTPCodeString(
        commandCenterSecret,
        now + w * 30000,
        length: 6,
        interval: 30,
        algorithm: Algorithm.SHA1,
        isGoogle: true,
      );
      if (OTP.constantTimeVerification(normalized, expected)) {
        return;
      }
    }
    throw IdentityVerificationException(
      'Invalid Command Center authorization code.',
    );
  }

  /// Current 6-digit TOTP for [commandCenterSecret] (same algorithm as [verifyVolunteerOtp]).
  ///
  /// Dev / hackathon helper for on-screen display — remove before production.
  static String debugCurrentCommandCenterTotp() {
    return OTP.generateTOTPCodeString(
      commandCenterSecret,
      DateTime.now().millisecondsSinceEpoch,
      length: 6,
      interval: 30,
      algorithm: Algorithm.SHA1,
      isGoogle: true,
    );
  }

  /// Generates Ed25519 keys if none exist. Call only after [verifyVolunteerOtp] succeeds.
  ///
  /// If keys already exist (e.g. interrupted onboarding), loads the existing identity.
  Future<IdentityBootstrapResult> createIdentityAfterOtpVerification() async {
    final String? existing = await _storage.read(key: _kPrivateKeyStorageKey);
    if (existing != null && existing.isNotEmpty) {
      return _loadExistingIdentity(existing);
    }
    return _createNewIdentity();
  }

  Future<IdentityBootstrapResult> _createNewIdentity() async {
    final keyPair = await _ed25519.newKeyPair();
    final List<int> privateBytes = await keyPair.extractPrivateKeyBytes();
    final SimplePublicKey publicKey = await keyPair.extractPublicKey();
    final String pubB64 = base64Encode(publicKey.bytes);

    final String nodeId = await _nodeIdFromPublicKey(publicKey);

    await _storage.write(
      key: _kPrivateKeyStorageKey,
      value: base64Encode(privateBytes),
    );

    await _ledger.upsertNode(
      nodeId,
      pubB64,
      kDefaultBootstrapRole,
      'SELF',
    );
    await _ledger.upsertVectorClock(nodeId, 1);

    return IdentityBootstrapResult(
      nodeId: nodeId,
      publicKeyBase64: pubB64,
      createdNewIdentity: true,
    );
  }

  Future<IdentityBootstrapResult> _loadExistingIdentity(
    String privateKeyBase64,
  ) async {
    final List<int> seed = base64Decode(privateKeyBase64);
    final keyPair = await _ed25519.newKeyPairFromSeed(seed);
    final SimplePublicKey publicKey = await keyPair.extractPublicKey();
    final String pubB64 = base64Encode(publicKey.bytes);
    final String nodeId = await _nodeIdFromPublicKey(publicKey);

    return IdentityBootstrapResult(
      nodeId: nodeId,
      publicKeyBase64: pubB64,
      createdNewIdentity: false,
    );
  }

  Future<String> _nodeIdFromPublicKey(SimplePublicKey publicKey) async {
    final digest = await Sha256().hash(publicKey.bytes);
    final List<int> bytes = digest.bytes;
    final StringBuffer sb = StringBuffer();
    for (final int b in bytes) {
      sb.write(b.toRadixString(16).padLeft(2, '0'));
    }
    return sb.toString();
  }

  /// Display name from onboarding (`kDisplayNameStorageKey`), if saved.
  Future<String?> readDisplayName() async {
    final String? v = await _storage.read(key: kDisplayNameStorageKey);
    if (v == null) {
      return null;
    }
    final String t = v.trim();
    return t.isEmpty ? null : t;
  }

  /// [LocalLedger] role value for [nodeId] (e.g. self), or [kDefaultBootstrapRole].
  Future<int> roleForNode(String nodeId) async {
    final KnownNodeRecord? row = await _ledger.getNode(nodeId);
    return row?.role ?? kDefaultBootstrapRole;
  }
}
