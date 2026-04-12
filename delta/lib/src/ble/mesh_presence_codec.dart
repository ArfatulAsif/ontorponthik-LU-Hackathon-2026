import 'dart:convert';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';

import '../generated/digitaldelta.pbenum.dart';

/// Compact mesh presence in BLE **scan response** manufacturer data
/// (company id [manufacturerId]).
///
/// Public keys do not fit here; they are sent only in [UserIdentity] over sync.
class MeshPresenceCodec {
  MeshPresenceCodec._();

  /// Unregistered test / internal company id (16-bit). Both peers must match.
  static const int manufacturerId = 0xdda1;

  static const int _version = 1;
  static const int _maxPayloadBytes = 22;

  static List<int> encode({
    required int roleValue,
    required String displayName,
  }) {
    final List<int> nameBytes = utf8.encode(displayName.trim());
    final int maxName = _maxPayloadBytes - 2;
    final List<int> cut = nameBytes.length > maxName
        ? nameBytes.sublist(0, maxName)
        : nameBytes;
    return <int>[_version, roleValue & 0xff, ...cut];
  }

  /// Reads [AdvertisementData.manufacturerData] (AD + scan response merged).
  static MeshPresence? decode(AdvertisementData ad) {
    final List<int>? raw = ad.manufacturerData[manufacturerId];
    if (raw == null || raw.length < 2) {
      return null;
    }
    if (raw[0] != _version) {
      return null;
    }
    final int roleValue = raw[1];
    String displayName;
    if (raw.length <= 2) {
      displayName = '';
    } else {
      displayName = utf8.decode(raw.sublist(2), allowMalformed: true).trim();
    }
    if (displayName.isEmpty) {
      displayName = 'Mesh peer';
    }
    return MeshPresence(
      displayName: displayName,
      roleValue: roleValue,
    );
  }

  static String roleLabel(int value) {
    final Role? r = Role.valueOf(value);
    if (r == null) {
      return 'Role $value';
    }
    if (r == Role.FIELD_VOLUNTEER) return 'Field volunteer';
    if (r == Role.SUPPLY_MANAGER) return 'Supply manager';
    if (r == Role.DRONE_OPERATOR) return 'Drone operator';
    if (r == Role.CAMP_COMMANDER) return 'Camp commander';
    if (r == Role.SYNC_ADMIN) return 'Sync admin';
    if (r == Role.ROLE_UNSPECIFIED) return 'Unspecified';
    return r.name;
  }
}

class MeshPresence {
  const MeshPresence({
    required this.displayName,
    required this.roleValue,
  });

  final String displayName;
  final int roleValue;
}
