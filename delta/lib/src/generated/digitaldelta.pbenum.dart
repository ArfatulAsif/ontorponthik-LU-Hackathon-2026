// This is a generated file - do not edit.
//
// Generated from digitaldelta.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

class Role extends $pb.ProtobufEnum {
  static const Role ROLE_UNSPECIFIED =
      Role._(0, _omitEnumNames ? '' : 'ROLE_UNSPECIFIED');
  static const Role FIELD_VOLUNTEER =
      Role._(1, _omitEnumNames ? '' : 'FIELD_VOLUNTEER');
  static const Role SUPPLY_MANAGER =
      Role._(2, _omitEnumNames ? '' : 'SUPPLY_MANAGER');
  static const Role DRONE_OPERATOR =
      Role._(3, _omitEnumNames ? '' : 'DRONE_OPERATOR');
  static const Role CAMP_COMMANDER =
      Role._(4, _omitEnumNames ? '' : 'CAMP_COMMANDER');
  static const Role SYNC_ADMIN = Role._(5, _omitEnumNames ? '' : 'SYNC_ADMIN');

  static const $core.List<Role> values = <Role>[
    ROLE_UNSPECIFIED,
    FIELD_VOLUNTEER,
    SUPPLY_MANAGER,
    DRONE_OPERATOR,
    CAMP_COMMANDER,
    SYNC_ADMIN,
  ];

  static final $core.List<Role?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 5);
  static Role? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const Role._(super.value, super.name);
}

class ItemCategory extends $pb.ProtobufEnum {
  static const ItemCategory CAT_UNSPECIFIED =
      ItemCategory._(0, _omitEnumNames ? '' : 'CAT_UNSPECIFIED');
  static const ItemCategory MEDICINE =
      ItemCategory._(1, _omitEnumNames ? '' : 'MEDICINE');
  static const ItemCategory FOODS =
      ItemCategory._(2, _omitEnumNames ? '' : 'FOODS');
  static const ItemCategory CLOTHS =
      ItemCategory._(3, _omitEnumNames ? '' : 'CLOTHS');
  static const ItemCategory WATER =
      ItemCategory._(4, _omitEnumNames ? '' : 'WATER');

  static const $core.List<ItemCategory> values = <ItemCategory>[
    CAT_UNSPECIFIED,
    MEDICINE,
    FOODS,
    CLOTHS,
    WATER,
  ];

  static final $core.List<ItemCategory?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 4);
  static ItemCategory? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const ItemCategory._(super.value, super.name);
}

class Priority extends $pb.ProtobufEnum {
  static const Priority P3_LOW = Priority._(0, _omitEnumNames ? '' : 'P3_LOW');
  static const Priority P2_STANDARD =
      Priority._(1, _omitEnumNames ? '' : 'P2_STANDARD');
  static const Priority P1_HIGH =
      Priority._(2, _omitEnumNames ? '' : 'P1_HIGH');
  static const Priority P0_CRITICAL =
      Priority._(3, _omitEnumNames ? '' : 'P0_CRITICAL');

  static const $core.List<Priority> values = <Priority>[
    P3_LOW,
    P2_STANDARD,
    P1_HIGH,
    P0_CRITICAL,
  ];

  static final $core.List<Priority?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 3);
  static Priority? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const Priority._(super.value, super.name);
}

class TaskStatus extends $pb.ProtobufEnum {
  static const TaskStatus PENDING =
      TaskStatus._(0, _omitEnumNames ? '' : 'PENDING');
  static const TaskStatus ASSIGNED =
      TaskStatus._(1, _omitEnumNames ? '' : 'ASSIGNED');
  static const TaskStatus IN_TRANSIT =
      TaskStatus._(2, _omitEnumNames ? '' : 'IN_TRANSIT');
  static const TaskStatus HANDOFF_IN_PROGRESS =
      TaskStatus._(3, _omitEnumNames ? '' : 'HANDOFF_IN_PROGRESS');
  static const TaskStatus DELIVERED =
      TaskStatus._(4, _omitEnumNames ? '' : 'DELIVERED');

  static const $core.List<TaskStatus> values = <TaskStatus>[
    PENDING,
    ASSIGNED,
    IN_TRANSIT,
    HANDOFF_IN_PROGRESS,
    DELIVERED,
  ];

  static final $core.List<TaskStatus?> _byValue =
      $pb.ProtobufEnum.$_initByValueList(values, 4);
  static TaskStatus? valueOf($core.int value) =>
      value < 0 || value >= _byValue.length ? null : _byValue[value];

  const TaskStatus._(super.value, super.name);
}

const $core.bool _omitEnumNames =
    $core.bool.fromEnvironment('protobuf.omit_enum_names');
