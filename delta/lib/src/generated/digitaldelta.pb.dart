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

import 'package:fixnum/fixnum.dart' as $fixnum;
import 'package:protobuf/protobuf.dart' as $pb;

import 'digitaldelta.pbenum.dart';

export 'package:protobuf/protobuf.dart' show GeneratedMessageGenericExtensions;

export 'digitaldelta.pbenum.dart';

class VectorClock extends $pb.GeneratedMessage {
  factory VectorClock({
    $core.Iterable<$core.MapEntry<$core.String, $core.int>>? counters,
  }) {
    final result = create();
    if (counters != null) result.counters.addEntries(counters);
    return result;
  }

  VectorClock._();

  factory VectorClock.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory VectorClock.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'VectorClock',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..m<$core.String, $core.int>(1, _omitFieldNames ? '' : 'counters',
        entryClassName: 'VectorClock.CountersEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.O3,
        packageName: const $pb.PackageName('digitaldelta'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  VectorClock clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  VectorClock copyWith(void Function(VectorClock) updates) =>
      super.copyWith((message) => updates(message as VectorClock))
          as VectorClock;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static VectorClock create() => VectorClock._();
  @$core.override
  VectorClock createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static VectorClock getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<VectorClock>(create);
  static VectorClock? _defaultInstance;

  @$pb.TagNumber(1)
  $pb.PbMap<$core.String, $core.int> get counters => $_getMap(0);
}

/// Grow-only CRDT: per-node partial counts; global sum = total resources distributed.
class GCounter extends $pb.GeneratedMessage {
  factory GCounter({
    $core.Iterable<$core.MapEntry<$core.String, $core.int>>? increments,
  }) {
    final result = create();
    if (increments != null) result.increments.addEntries(increments);
    return result;
  }

  GCounter._();

  factory GCounter.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory GCounter.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'GCounter',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..m<$core.String, $core.int>(1, _omitFieldNames ? '' : 'increments',
        entryClassName: 'GCounter.IncrementsEntry',
        keyFieldType: $pb.PbFieldType.OS,
        valueFieldType: $pb.PbFieldType.O3,
        packageName: const $pb.PackageName('digitaldelta'))
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  GCounter clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  GCounter copyWith(void Function(GCounter) updates) =>
      super.copyWith((message) => updates(message as GCounter)) as GCounter;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static GCounter create() => GCounter._();
  @$core.override
  GCounter createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static GCounter getDefault() =>
      _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GCounter>(create);
  static GCounter? _defaultInstance;

  @$pb.TagNumber(1)
  $pb.PbMap<$core.String, $core.int> get increments => $_getMap(0);
}

class MeshMetadata extends $pb.GeneratedMessage {
  factory MeshMetadata({
    $core.String? creatorNodeId,
    $core.List<$core.int>? signature,
    VectorClock? clock,
    $fixnum.Int64? timestamp,
  }) {
    final result = create();
    if (creatorNodeId != null) result.creatorNodeId = creatorNodeId;
    if (signature != null) result.signature = signature;
    if (clock != null) result.clock = clock;
    if (timestamp != null) result.timestamp = timestamp;
    return result;
  }

  MeshMetadata._();

  factory MeshMetadata.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory MeshMetadata.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'MeshMetadata',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'creatorNodeId')
    ..a<$core.List<$core.int>>(
        2, _omitFieldNames ? '' : 'signature', $pb.PbFieldType.OY)
    ..aOM<VectorClock>(3, _omitFieldNames ? '' : 'clock',
        subBuilder: VectorClock.create)
    ..aInt64(4, _omitFieldNames ? '' : 'timestamp')
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MeshMetadata clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  MeshMetadata copyWith(void Function(MeshMetadata) updates) =>
      super.copyWith((message) => updates(message as MeshMetadata))
          as MeshMetadata;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static MeshMetadata create() => MeshMetadata._();
  @$core.override
  MeshMetadata createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static MeshMetadata getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<MeshMetadata>(create);
  static MeshMetadata? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get creatorNodeId => $_getSZ(0);
  @$pb.TagNumber(1)
  set creatorNodeId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasCreatorNodeId() => $_has(0);
  @$pb.TagNumber(1)
  void clearCreatorNodeId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.List<$core.int> get signature => $_getN(1);
  @$pb.TagNumber(2)
  set signature($core.List<$core.int> value) => $_setBytes(1, value);
  @$pb.TagNumber(2)
  $core.bool hasSignature() => $_has(1);
  @$pb.TagNumber(2)
  void clearSignature() => $_clearField(2);

  @$pb.TagNumber(3)
  VectorClock get clock => $_getN(2);
  @$pb.TagNumber(3)
  set clock(VectorClock value) => $_setField(3, value);
  @$pb.TagNumber(3)
  $core.bool hasClock() => $_has(2);
  @$pb.TagNumber(3)
  void clearClock() => $_clearField(3);
  @$pb.TagNumber(3)
  VectorClock ensureClock() => $_ensure(2);

  @$pb.TagNumber(4)
  $fixnum.Int64 get timestamp => $_getI64(3);
  @$pb.TagNumber(4)
  set timestamp($fixnum.Int64 value) => $_setInt64(3, value);
  @$pb.TagNumber(4)
  $core.bool hasTimestamp() => $_has(3);
  @$pb.TagNumber(4)
  void clearTimestamp() => $_clearField(4);
}

class TriageRequest extends $pb.GeneratedMessage {
  factory TriageRequest({
    $core.String? requestId,
    $core.String? campNodeId,
    ItemCategory? category,
    Priority? priority,
    $core.int? quantityNeeded,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (requestId != null) result.requestId = requestId;
    if (campNodeId != null) result.campNodeId = campNodeId;
    if (category != null) result.category = category;
    if (priority != null) result.priority = priority;
    if (quantityNeeded != null) result.quantityNeeded = quantityNeeded;
    if (meta != null) result.meta = meta;
    return result;
  }

  TriageRequest._();

  factory TriageRequest.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory TriageRequest.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'TriageRequest',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'requestId')
    ..aOS(2, _omitFieldNames ? '' : 'campNodeId')
    ..aE<ItemCategory>(3, _omitFieldNames ? '' : 'category',
        enumValues: ItemCategory.values)
    ..aE<Priority>(4, _omitFieldNames ? '' : 'priority',
        enumValues: Priority.values)
    ..aI(5, _omitFieldNames ? '' : 'quantityNeeded')
    ..aOM<MeshMetadata>(6, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  TriageRequest clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  TriageRequest copyWith(void Function(TriageRequest) updates) =>
      super.copyWith((message) => updates(message as TriageRequest))
          as TriageRequest;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static TriageRequest create() => TriageRequest._();
  @$core.override
  TriageRequest createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static TriageRequest getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<TriageRequest>(create);
  static TriageRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get requestId => $_getSZ(0);
  @$pb.TagNumber(1)
  set requestId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasRequestId() => $_has(0);
  @$pb.TagNumber(1)
  void clearRequestId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get campNodeId => $_getSZ(1);
  @$pb.TagNumber(2)
  set campNodeId($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasCampNodeId() => $_has(1);
  @$pb.TagNumber(2)
  void clearCampNodeId() => $_clearField(2);

  @$pb.TagNumber(3)
  ItemCategory get category => $_getN(2);
  @$pb.TagNumber(3)
  set category(ItemCategory value) => $_setField(3, value);
  @$pb.TagNumber(3)
  $core.bool hasCategory() => $_has(2);
  @$pb.TagNumber(3)
  void clearCategory() => $_clearField(3);

  @$pb.TagNumber(4)
  Priority get priority => $_getN(3);
  @$pb.TagNumber(4)
  set priority(Priority value) => $_setField(4, value);
  @$pb.TagNumber(4)
  $core.bool hasPriority() => $_has(3);
  @$pb.TagNumber(4)
  void clearPriority() => $_clearField(4);

  @$pb.TagNumber(5)
  $core.int get quantityNeeded => $_getIZ(4);
  @$pb.TagNumber(5)
  set quantityNeeded($core.int value) => $_setSignedInt32(4, value);
  @$pb.TagNumber(5)
  $core.bool hasQuantityNeeded() => $_has(4);
  @$pb.TagNumber(5)
  void clearQuantityNeeded() => $_clearField(5);

  @$pb.TagNumber(6)
  MeshMetadata get meta => $_getN(5);
  @$pb.TagNumber(6)
  set meta(MeshMetadata value) => $_setField(6, value);
  @$pb.TagNumber(6)
  $core.bool hasMeta() => $_has(5);
  @$pb.TagNumber(6)
  void clearMeta() => $_clearField(6);
  @$pb.TagNumber(6)
  MeshMetadata ensureMeta() => $_ensure(5);
}

class InventoryStock extends $pb.GeneratedMessage {
  factory InventoryStock({
    $core.String? hubId,
    ItemCategory? category,
    $core.int? currentQuantity,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (hubId != null) result.hubId = hubId;
    if (category != null) result.category = category;
    if (currentQuantity != null) result.currentQuantity = currentQuantity;
    if (meta != null) result.meta = meta;
    return result;
  }

  InventoryStock._();

  factory InventoryStock.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory InventoryStock.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'InventoryStock',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'hubId')
    ..aE<ItemCategory>(2, _omitFieldNames ? '' : 'category',
        enumValues: ItemCategory.values)
    ..aI(3, _omitFieldNames ? '' : 'currentQuantity')
    ..aOM<MeshMetadata>(4, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  InventoryStock clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  InventoryStock copyWith(void Function(InventoryStock) updates) =>
      super.copyWith((message) => updates(message as InventoryStock))
          as InventoryStock;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static InventoryStock create() => InventoryStock._();
  @$core.override
  InventoryStock createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static InventoryStock getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<InventoryStock>(create);
  static InventoryStock? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get hubId => $_getSZ(0);
  @$pb.TagNumber(1)
  set hubId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasHubId() => $_has(0);
  @$pb.TagNumber(1)
  void clearHubId() => $_clearField(1);

  @$pb.TagNumber(2)
  ItemCategory get category => $_getN(1);
  @$pb.TagNumber(2)
  set category(ItemCategory value) => $_setField(2, value);
  @$pb.TagNumber(2)
  $core.bool hasCategory() => $_has(1);
  @$pb.TagNumber(2)
  void clearCategory() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.int get currentQuantity => $_getIZ(2);
  @$pb.TagNumber(3)
  set currentQuantity($core.int value) => $_setSignedInt32(2, value);
  @$pb.TagNumber(3)
  $core.bool hasCurrentQuantity() => $_has(2);
  @$pb.TagNumber(3)
  void clearCurrentQuantity() => $_clearField(3);

  @$pb.TagNumber(4)
  MeshMetadata get meta => $_getN(3);
  @$pb.TagNumber(4)
  set meta(MeshMetadata value) => $_setField(4, value);
  @$pb.TagNumber(4)
  $core.bool hasMeta() => $_has(3);
  @$pb.TagNumber(4)
  void clearMeta() => $_clearField(4);
  @$pb.TagNumber(4)
  MeshMetadata ensureMeta() => $_ensure(3);
}

class RoadStatus extends $pb.GeneratedMessage {
  factory RoadStatus({
    $core.String? edgeId,
    $core.bool? isFlooded,
    $core.double? floodProbability,
    $core.int? weightPenalty,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (edgeId != null) result.edgeId = edgeId;
    if (isFlooded != null) result.isFlooded = isFlooded;
    if (floodProbability != null) result.floodProbability = floodProbability;
    if (weightPenalty != null) result.weightPenalty = weightPenalty;
    if (meta != null) result.meta = meta;
    return result;
  }

  RoadStatus._();

  factory RoadStatus.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory RoadStatus.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'RoadStatus',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'edgeId')
    ..aOB(2, _omitFieldNames ? '' : 'isFlooded')
    ..aD(3, _omitFieldNames ? '' : 'floodProbability',
        fieldType: $pb.PbFieldType.OF)
    ..aI(4, _omitFieldNames ? '' : 'weightPenalty')
    ..aOM<MeshMetadata>(5, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RoadStatus clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  RoadStatus copyWith(void Function(RoadStatus) updates) =>
      super.copyWith((message) => updates(message as RoadStatus)) as RoadStatus;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static RoadStatus create() => RoadStatus._();
  @$core.override
  RoadStatus createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static RoadStatus getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<RoadStatus>(create);
  static RoadStatus? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get edgeId => $_getSZ(0);
  @$pb.TagNumber(1)
  set edgeId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasEdgeId() => $_has(0);
  @$pb.TagNumber(1)
  void clearEdgeId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.bool get isFlooded => $_getBF(1);
  @$pb.TagNumber(2)
  set isFlooded($core.bool value) => $_setBool(1, value);
  @$pb.TagNumber(2)
  $core.bool hasIsFlooded() => $_has(1);
  @$pb.TagNumber(2)
  void clearIsFlooded() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.double get floodProbability => $_getN(2);
  @$pb.TagNumber(3)
  set floodProbability($core.double value) => $_setFloat(2, value);
  @$pb.TagNumber(3)
  $core.bool hasFloodProbability() => $_has(2);
  @$pb.TagNumber(3)
  void clearFloodProbability() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.int get weightPenalty => $_getIZ(3);
  @$pb.TagNumber(4)
  set weightPenalty($core.int value) => $_setSignedInt32(3, value);
  @$pb.TagNumber(4)
  $core.bool hasWeightPenalty() => $_has(3);
  @$pb.TagNumber(4)
  void clearWeightPenalty() => $_clearField(4);

  @$pb.TagNumber(5)
  MeshMetadata get meta => $_getN(4);
  @$pb.TagNumber(5)
  set meta(MeshMetadata value) => $_setField(5, value);
  @$pb.TagNumber(5)
  $core.bool hasMeta() => $_has(4);
  @$pb.TagNumber(5)
  void clearMeta() => $_clearField(5);
  @$pb.TagNumber(5)
  MeshMetadata ensureMeta() => $_ensure(4);
}

class ChatMessage extends $pb.GeneratedMessage {
  factory ChatMessage({
    $core.String? messageId,
    $core.String? recipientNodeId,
    $core.String? content,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (messageId != null) result.messageId = messageId;
    if (recipientNodeId != null) result.recipientNodeId = recipientNodeId;
    if (content != null) result.content = content;
    if (meta != null) result.meta = meta;
    return result;
  }

  ChatMessage._();

  factory ChatMessage.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory ChatMessage.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'ChatMessage',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'messageId')
    ..aOS(2, _omitFieldNames ? '' : 'recipientNodeId')
    ..aOS(3, _omitFieldNames ? '' : 'content')
    ..aOM<MeshMetadata>(4, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ChatMessage clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  ChatMessage copyWith(void Function(ChatMessage) updates) =>
      super.copyWith((message) => updates(message as ChatMessage))
          as ChatMessage;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static ChatMessage create() => ChatMessage._();
  @$core.override
  ChatMessage createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static ChatMessage getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<ChatMessage>(create);
  static ChatMessage? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get messageId => $_getSZ(0);
  @$pb.TagNumber(1)
  set messageId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasMessageId() => $_has(0);
  @$pb.TagNumber(1)
  void clearMessageId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get recipientNodeId => $_getSZ(1);
  @$pb.TagNumber(2)
  set recipientNodeId($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasRecipientNodeId() => $_has(1);
  @$pb.TagNumber(2)
  void clearRecipientNodeId() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get content => $_getSZ(2);
  @$pb.TagNumber(3)
  set content($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasContent() => $_has(2);
  @$pb.TagNumber(3)
  void clearContent() => $_clearField(3);

  @$pb.TagNumber(4)
  MeshMetadata get meta => $_getN(3);
  @$pb.TagNumber(4)
  set meta(MeshMetadata value) => $_setField(4, value);
  @$pb.TagNumber(4)
  $core.bool hasMeta() => $_has(3);
  @$pb.TagNumber(4)
  void clearMeta() => $_clearField(4);
  @$pb.TagNumber(4)
  MeshMetadata ensureMeta() => $_ensure(3);
}

class DeliveryTask extends $pb.GeneratedMessage {
  factory DeliveryTask({
    $core.String? taskId,
    $core.String? currentHolderId,
    TriageRequest? originalRequest,
    TaskStatus? status,
    $core.List<$core.int>? managerSignature,
    $core.List<$core.int>? campCommanderSig,
    $core.List<$core.int>? droneOperatorSig,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (taskId != null) result.taskId = taskId;
    if (currentHolderId != null) result.currentHolderId = currentHolderId;
    if (originalRequest != null) result.originalRequest = originalRequest;
    if (status != null) result.status = status;
    if (managerSignature != null) result.managerSignature = managerSignature;
    if (campCommanderSig != null) result.campCommanderSig = campCommanderSig;
    if (droneOperatorSig != null) result.droneOperatorSig = droneOperatorSig;
    if (meta != null) result.meta = meta;
    return result;
  }

  DeliveryTask._();

  factory DeliveryTask.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory DeliveryTask.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'DeliveryTask',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'taskId')
    ..aOS(2, _omitFieldNames ? '' : 'currentHolderId')
    ..aOM<TriageRequest>(3, _omitFieldNames ? '' : 'originalRequest',
        subBuilder: TriageRequest.create)
    ..aE<TaskStatus>(4, _omitFieldNames ? '' : 'status',
        enumValues: TaskStatus.values)
    ..a<$core.List<$core.int>>(
        5, _omitFieldNames ? '' : 'managerSignature', $pb.PbFieldType.OY)
    ..a<$core.List<$core.int>>(
        6, _omitFieldNames ? '' : 'campCommanderSig', $pb.PbFieldType.OY)
    ..a<$core.List<$core.int>>(
        7, _omitFieldNames ? '' : 'droneOperatorSig', $pb.PbFieldType.OY)
    ..aOM<MeshMetadata>(8, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  DeliveryTask clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  DeliveryTask copyWith(void Function(DeliveryTask) updates) =>
      super.copyWith((message) => updates(message as DeliveryTask))
          as DeliveryTask;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static DeliveryTask create() => DeliveryTask._();
  @$core.override
  DeliveryTask createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static DeliveryTask getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<DeliveryTask>(create);
  static DeliveryTask? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get taskId => $_getSZ(0);
  @$pb.TagNumber(1)
  set taskId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasTaskId() => $_has(0);
  @$pb.TagNumber(1)
  void clearTaskId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.String get currentHolderId => $_getSZ(1);
  @$pb.TagNumber(2)
  set currentHolderId($core.String value) => $_setString(1, value);
  @$pb.TagNumber(2)
  $core.bool hasCurrentHolderId() => $_has(1);
  @$pb.TagNumber(2)
  void clearCurrentHolderId() => $_clearField(2);

  @$pb.TagNumber(3)
  TriageRequest get originalRequest => $_getN(2);
  @$pb.TagNumber(3)
  set originalRequest(TriageRequest value) => $_setField(3, value);
  @$pb.TagNumber(3)
  $core.bool hasOriginalRequest() => $_has(2);
  @$pb.TagNumber(3)
  void clearOriginalRequest() => $_clearField(3);
  @$pb.TagNumber(3)
  TriageRequest ensureOriginalRequest() => $_ensure(2);

  @$pb.TagNumber(4)
  TaskStatus get status => $_getN(3);
  @$pb.TagNumber(4)
  set status(TaskStatus value) => $_setField(4, value);
  @$pb.TagNumber(4)
  $core.bool hasStatus() => $_has(3);
  @$pb.TagNumber(4)
  void clearStatus() => $_clearField(4);

  /// Chain of custody signatures
  @$pb.TagNumber(5)
  $core.List<$core.int> get managerSignature => $_getN(4);
  @$pb.TagNumber(5)
  set managerSignature($core.List<$core.int> value) => $_setBytes(4, value);
  @$pb.TagNumber(5)
  $core.bool hasManagerSignature() => $_has(4);
  @$pb.TagNumber(5)
  void clearManagerSignature() => $_clearField(5);

  @$pb.TagNumber(6)
  $core.List<$core.int> get campCommanderSig => $_getN(5);
  @$pb.TagNumber(6)
  set campCommanderSig($core.List<$core.int> value) => $_setBytes(5, value);
  @$pb.TagNumber(6)
  $core.bool hasCampCommanderSig() => $_has(5);
  @$pb.TagNumber(6)
  void clearCampCommanderSig() => $_clearField(6);

  @$pb.TagNumber(7)
  $core.List<$core.int> get droneOperatorSig => $_getN(6);
  @$pb.TagNumber(7)
  set droneOperatorSig($core.List<$core.int> value) => $_setBytes(6, value);
  @$pb.TagNumber(7)
  $core.bool hasDroneOperatorSig() => $_has(6);
  @$pb.TagNumber(7)
  void clearDroneOperatorSig() => $_clearField(7);

  @$pb.TagNumber(8)
  MeshMetadata get meta => $_getN(7);
  @$pb.TagNumber(8)
  set meta(MeshMetadata value) => $_setField(8, value);
  @$pb.TagNumber(8)
  $core.bool hasMeta() => $_has(7);
  @$pb.TagNumber(8)
  void clearMeta() => $_clearField(8);
  @$pb.TagNumber(8)
  MeshMetadata ensureMeta() => $_ensure(7);
}

enum SyncEnvelope_Payload {
  triageUpdate,
  inventoryUpdate,
  roadUpdate,
  taskUpdate,
  registration,
  chatUpdate,
  notSet
}

class SyncEnvelope extends $pb.GeneratedMessage {
  factory SyncEnvelope({
    $core.String? senderNodeId,
    $core.List<$core.int>? senderPublicKey,
    TriageRequest? triageUpdate,
    InventoryStock? inventoryUpdate,
    RoadStatus? roadUpdate,
    DeliveryTask? taskUpdate,
    UserIdentity? registration,
    ChatMessage? chatUpdate,
    GCounter? resourceCounter,
  }) {
    final result = create();
    if (senderNodeId != null) result.senderNodeId = senderNodeId;
    if (senderPublicKey != null) result.senderPublicKey = senderPublicKey;
    if (triageUpdate != null) result.triageUpdate = triageUpdate;
    if (inventoryUpdate != null) result.inventoryUpdate = inventoryUpdate;
    if (roadUpdate != null) result.roadUpdate = roadUpdate;
    if (taskUpdate != null) result.taskUpdate = taskUpdate;
    if (registration != null) result.registration = registration;
    if (chatUpdate != null) result.chatUpdate = chatUpdate;
    if (resourceCounter != null) result.resourceCounter = resourceCounter;
    return result;
  }

  SyncEnvelope._();

  factory SyncEnvelope.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory SyncEnvelope.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static const $core.Map<$core.int, SyncEnvelope_Payload>
      _SyncEnvelope_PayloadByTag = {
    3: SyncEnvelope_Payload.triageUpdate,
    4: SyncEnvelope_Payload.inventoryUpdate,
    5: SyncEnvelope_Payload.roadUpdate,
    6: SyncEnvelope_Payload.taskUpdate,
    7: SyncEnvelope_Payload.registration,
    8: SyncEnvelope_Payload.chatUpdate,
    0: SyncEnvelope_Payload.notSet
  };
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'SyncEnvelope',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..oo(0, [3, 4, 5, 6, 7, 8])
    ..aOS(1, _omitFieldNames ? '' : 'senderNodeId')
    ..a<$core.List<$core.int>>(
        2, _omitFieldNames ? '' : 'senderPublicKey', $pb.PbFieldType.OY)
    ..aOM<TriageRequest>(3, _omitFieldNames ? '' : 'triageUpdate',
        subBuilder: TriageRequest.create)
    ..aOM<InventoryStock>(4, _omitFieldNames ? '' : 'inventoryUpdate',
        subBuilder: InventoryStock.create)
    ..aOM<RoadStatus>(5, _omitFieldNames ? '' : 'roadUpdate',
        subBuilder: RoadStatus.create)
    ..aOM<DeliveryTask>(6, _omitFieldNames ? '' : 'taskUpdate',
        subBuilder: DeliveryTask.create)
    ..aOM<UserIdentity>(7, _omitFieldNames ? '' : 'registration',
        subBuilder: UserIdentity.create)
    ..aOM<ChatMessage>(8, _omitFieldNames ? '' : 'chatUpdate',
        subBuilder: ChatMessage.create)
    ..aOM<GCounter>(10, _omitFieldNames ? '' : 'resourceCounter',
        subBuilder: GCounter.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  SyncEnvelope clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  SyncEnvelope copyWith(void Function(SyncEnvelope) updates) =>
      super.copyWith((message) => updates(message as SyncEnvelope))
          as SyncEnvelope;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static SyncEnvelope create() => SyncEnvelope._();
  @$core.override
  SyncEnvelope createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static SyncEnvelope getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<SyncEnvelope>(create);
  static SyncEnvelope? _defaultInstance;

  @$pb.TagNumber(3)
  @$pb.TagNumber(4)
  @$pb.TagNumber(5)
  @$pb.TagNumber(6)
  @$pb.TagNumber(7)
  @$pb.TagNumber(8)
  SyncEnvelope_Payload whichPayload() =>
      _SyncEnvelope_PayloadByTag[$_whichOneof(0)]!;
  @$pb.TagNumber(3)
  @$pb.TagNumber(4)
  @$pb.TagNumber(5)
  @$pb.TagNumber(6)
  @$pb.TagNumber(7)
  @$pb.TagNumber(8)
  void clearPayload() => $_clearField($_whichOneof(0));

  @$pb.TagNumber(1)
  $core.String get senderNodeId => $_getSZ(0);
  @$pb.TagNumber(1)
  set senderNodeId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasSenderNodeId() => $_has(0);
  @$pb.TagNumber(1)
  void clearSenderNodeId() => $_clearField(1);

  @$pb.TagNumber(2)
  $core.List<$core.int> get senderPublicKey => $_getN(1);
  @$pb.TagNumber(2)
  set senderPublicKey($core.List<$core.int> value) => $_setBytes(1, value);
  @$pb.TagNumber(2)
  $core.bool hasSenderPublicKey() => $_has(1);
  @$pb.TagNumber(2)
  void clearSenderPublicKey() => $_clearField(2);

  @$pb.TagNumber(3)
  TriageRequest get triageUpdate => $_getN(2);
  @$pb.TagNumber(3)
  set triageUpdate(TriageRequest value) => $_setField(3, value);
  @$pb.TagNumber(3)
  $core.bool hasTriageUpdate() => $_has(2);
  @$pb.TagNumber(3)
  void clearTriageUpdate() => $_clearField(3);
  @$pb.TagNumber(3)
  TriageRequest ensureTriageUpdate() => $_ensure(2);

  @$pb.TagNumber(4)
  InventoryStock get inventoryUpdate => $_getN(3);
  @$pb.TagNumber(4)
  set inventoryUpdate(InventoryStock value) => $_setField(4, value);
  @$pb.TagNumber(4)
  $core.bool hasInventoryUpdate() => $_has(3);
  @$pb.TagNumber(4)
  void clearInventoryUpdate() => $_clearField(4);
  @$pb.TagNumber(4)
  InventoryStock ensureInventoryUpdate() => $_ensure(3);

  @$pb.TagNumber(5)
  RoadStatus get roadUpdate => $_getN(4);
  @$pb.TagNumber(5)
  set roadUpdate(RoadStatus value) => $_setField(5, value);
  @$pb.TagNumber(5)
  $core.bool hasRoadUpdate() => $_has(4);
  @$pb.TagNumber(5)
  void clearRoadUpdate() => $_clearField(5);
  @$pb.TagNumber(5)
  RoadStatus ensureRoadUpdate() => $_ensure(4);

  @$pb.TagNumber(6)
  DeliveryTask get taskUpdate => $_getN(5);
  @$pb.TagNumber(6)
  set taskUpdate(DeliveryTask value) => $_setField(6, value);
  @$pb.TagNumber(6)
  $core.bool hasTaskUpdate() => $_has(5);
  @$pb.TagNumber(6)
  void clearTaskUpdate() => $_clearField(6);
  @$pb.TagNumber(6)
  DeliveryTask ensureTaskUpdate() => $_ensure(5);

  @$pb.TagNumber(7)
  UserIdentity get registration => $_getN(6);
  @$pb.TagNumber(7)
  set registration(UserIdentity value) => $_setField(7, value);
  @$pb.TagNumber(7)
  $core.bool hasRegistration() => $_has(6);
  @$pb.TagNumber(7)
  void clearRegistration() => $_clearField(7);
  @$pb.TagNumber(7)
  UserIdentity ensureRegistration() => $_ensure(6);

  @$pb.TagNumber(8)
  ChatMessage get chatUpdate => $_getN(7);
  @$pb.TagNumber(8)
  set chatUpdate(ChatMessage value) => $_setField(8, value);
  @$pb.TagNumber(8)
  $core.bool hasChatUpdate() => $_has(7);
  @$pb.TagNumber(8)
  void clearChatUpdate() => $_clearField(8);
  @$pb.TagNumber(8)
  ChatMessage ensureChatUpdate() => $_ensure(7);

  /// Field 4 is inventory_update inside [payload]; use 10 for the G-Counter to avoid tag clash.
  @$pb.TagNumber(10)
  GCounter get resourceCounter => $_getN(8);
  @$pb.TagNumber(10)
  set resourceCounter(GCounter value) => $_setField(10, value);
  @$pb.TagNumber(10)
  $core.bool hasResourceCounter() => $_has(8);
  @$pb.TagNumber(10)
  void clearResourceCounter() => $_clearField(10);
  @$pb.TagNumber(10)
  GCounter ensureResourceCounter() => $_ensure(8);
}

class UserIdentity extends $pb.GeneratedMessage {
  factory UserIdentity({
    $core.String? nodeId,
    Role? role,
    $core.String? displayName,
    $core.List<$core.int>? publicKey,
    MeshMetadata? meta,
  }) {
    final result = create();
    if (nodeId != null) result.nodeId = nodeId;
    if (role != null) result.role = role;
    if (displayName != null) result.displayName = displayName;
    if (publicKey != null) result.publicKey = publicKey;
    if (meta != null) result.meta = meta;
    return result;
  }

  UserIdentity._();

  factory UserIdentity.fromBuffer($core.List<$core.int> data,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromBuffer(data, registry);
  factory UserIdentity.fromJson($core.String json,
          [$pb.ExtensionRegistry registry = $pb.ExtensionRegistry.EMPTY]) =>
      create()..mergeFromJson(json, registry);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(
      _omitMessageNames ? '' : 'UserIdentity',
      package: const $pb.PackageName(_omitMessageNames ? '' : 'digitaldelta'),
      createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'nodeId')
    ..aE<Role>(2, _omitFieldNames ? '' : 'role', enumValues: Role.values)
    ..aOS(3, _omitFieldNames ? '' : 'displayName')
    ..a<$core.List<$core.int>>(
        4, _omitFieldNames ? '' : 'publicKey', $pb.PbFieldType.OY)
    ..aOM<MeshMetadata>(5, _omitFieldNames ? '' : 'meta',
        subBuilder: MeshMetadata.create)
    ..hasRequiredFields = false;

  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  UserIdentity clone() => deepCopy();
  @$core.Deprecated('See https://github.com/google/protobuf.dart/issues/998.')
  UserIdentity copyWith(void Function(UserIdentity) updates) =>
      super.copyWith((message) => updates(message as UserIdentity))
          as UserIdentity;

  @$core.override
  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static UserIdentity create() => UserIdentity._();
  @$core.override
  UserIdentity createEmptyInstance() => create();
  @$core.pragma('dart2js:noInline')
  static UserIdentity getDefault() => _defaultInstance ??=
      $pb.GeneratedMessage.$_defaultFor<UserIdentity>(create);
  static UserIdentity? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get nodeId => $_getSZ(0);
  @$pb.TagNumber(1)
  set nodeId($core.String value) => $_setString(0, value);
  @$pb.TagNumber(1)
  $core.bool hasNodeId() => $_has(0);
  @$pb.TagNumber(1)
  void clearNodeId() => $_clearField(1);

  @$pb.TagNumber(2)
  Role get role => $_getN(1);
  @$pb.TagNumber(2)
  set role(Role value) => $_setField(2, value);
  @$pb.TagNumber(2)
  $core.bool hasRole() => $_has(1);
  @$pb.TagNumber(2)
  void clearRole() => $_clearField(2);

  @$pb.TagNumber(3)
  $core.String get displayName => $_getSZ(2);
  @$pb.TagNumber(3)
  set displayName($core.String value) => $_setString(2, value);
  @$pb.TagNumber(3)
  $core.bool hasDisplayName() => $_has(2);
  @$pb.TagNumber(3)
  void clearDisplayName() => $_clearField(3);

  @$pb.TagNumber(4)
  $core.List<$core.int> get publicKey => $_getN(3);
  @$pb.TagNumber(4)
  set publicKey($core.List<$core.int> value) => $_setBytes(3, value);
  @$pb.TagNumber(4)
  $core.bool hasPublicKey() => $_has(3);
  @$pb.TagNumber(4)
  void clearPublicKey() => $_clearField(4);

  @$pb.TagNumber(5)
  MeshMetadata get meta => $_getN(4);
  @$pb.TagNumber(5)
  set meta(MeshMetadata value) => $_setField(5, value);
  @$pb.TagNumber(5)
  $core.bool hasMeta() => $_has(4);
  @$pb.TagNumber(5)
  void clearMeta() => $_clearField(5);
  @$pb.TagNumber(5)
  MeshMetadata ensureMeta() => $_ensure(4);
}

const $core.bool _omitFieldNames =
    $core.bool.fromEnvironment('protobuf.omit_field_names');
const $core.bool _omitMessageNames =
    $core.bool.fromEnvironment('protobuf.omit_message_names');
