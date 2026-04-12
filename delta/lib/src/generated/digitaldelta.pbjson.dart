// This is a generated file - do not edit.
//
// Generated from digitaldelta.proto.

// @dart = 3.3

// ignore_for_file: annotate_overrides, camel_case_types, comment_references
// ignore_for_file: constant_identifier_names
// ignore_for_file: curly_braces_in_flow_control_structures
// ignore_for_file: deprecated_member_use_from_same_package, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_relative_imports
// ignore_for_file: unused_import

import 'dart:convert' as $convert;
import 'dart:core' as $core;
import 'dart:typed_data' as $typed_data;

@$core.Deprecated('Use roleDescriptor instead')
const Role$json = {
  '1': 'Role',
  '2': [
    {'1': 'ROLE_UNSPECIFIED', '2': 0},
    {'1': 'FIELD_VOLUNTEER', '2': 1},
    {'1': 'SUPPLY_MANAGER', '2': 2},
    {'1': 'DRONE_OPERATOR', '2': 3},
    {'1': 'CAMP_COMMANDER', '2': 4},
    {'1': 'SYNC_ADMIN', '2': 5},
  ],
};

/// Descriptor for `Role`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List roleDescriptor = $convert.base64Decode(
    'CgRSb2xlEhQKEFJPTEVfVU5TUEVDSUZJRUQQABITCg9GSUVMRF9WT0xVTlRFRVIQARISCg5TVV'
    'BQTFlfTUFOQUdFUhACEhIKDkRST05FX09QRVJBVE9SEAMSEgoOQ0FNUF9DT01NQU5ERVIQBBIO'
    'CgpTWU5DX0FETUlOEAU=');

@$core.Deprecated('Use itemCategoryDescriptor instead')
const ItemCategory$json = {
  '1': 'ItemCategory',
  '2': [
    {'1': 'CAT_UNSPECIFIED', '2': 0},
    {'1': 'MEDICINE', '2': 1},
    {'1': 'FOODS', '2': 2},
    {'1': 'CLOTHS', '2': 3},
    {'1': 'WATER', '2': 4},
  ],
};

/// Descriptor for `ItemCategory`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List itemCategoryDescriptor = $convert.base64Decode(
    'CgxJdGVtQ2F0ZWdvcnkSEwoPQ0FUX1VOU1BFQ0lGSUVEEAASDAoITUVESUNJTkUQARIJCgVGT0'
    '9EUxACEgoKBkNMT1RIUxADEgkKBVdBVEVSEAQ=');

@$core.Deprecated('Use priorityDescriptor instead')
const Priority$json = {
  '1': 'Priority',
  '2': [
    {'1': 'P3_LOW', '2': 0},
    {'1': 'P2_STANDARD', '2': 1},
    {'1': 'P1_HIGH', '2': 2},
    {'1': 'P0_CRITICAL', '2': 3},
  ],
};

/// Descriptor for `Priority`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List priorityDescriptor = $convert.base64Decode(
    'CghQcmlvcml0eRIKCgZQM19MT1cQABIPCgtQMl9TVEFOREFSRBABEgsKB1AxX0hJR0gQAhIPCg'
    'tQMF9DUklUSUNBTBAD');

@$core.Deprecated('Use taskStatusDescriptor instead')
const TaskStatus$json = {
  '1': 'TaskStatus',
  '2': [
    {'1': 'PENDING', '2': 0},
    {'1': 'ASSIGNED', '2': 1},
    {'1': 'IN_TRANSIT', '2': 2},
    {'1': 'HANDOFF_IN_PROGRESS', '2': 3},
    {'1': 'DELIVERED', '2': 4},
  ],
};

/// Descriptor for `TaskStatus`. Decode as a `google.protobuf.EnumDescriptorProto`.
final $typed_data.Uint8List taskStatusDescriptor = $convert.base64Decode(
    'CgpUYXNrU3RhdHVzEgsKB1BFTkRJTkcQABIMCghBU1NJR05FRBABEg4KCklOX1RSQU5TSVQQAh'
    'IXChNIQU5ET0ZGX0lOX1BST0dSRVNTEAMSDQoJREVMSVZFUkVEEAQ=');

@$core.Deprecated('Use vectorClockDescriptor instead')
const VectorClock$json = {
  '1': 'VectorClock',
  '2': [
    {
      '1': 'counters',
      '3': 1,
      '4': 3,
      '5': 11,
      '6': '.digitaldelta.VectorClock.CountersEntry',
      '10': 'counters'
    },
  ],
  '3': [VectorClock_CountersEntry$json],
};

@$core.Deprecated('Use vectorClockDescriptor instead')
const VectorClock_CountersEntry$json = {
  '1': 'CountersEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {'1': 'value', '3': 2, '4': 1, '5': 5, '10': 'value'},
  ],
  '7': {'7': true},
};

/// Descriptor for `VectorClock`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List vectorClockDescriptor = $convert.base64Decode(
    'CgtWZWN0b3JDbG9jaxJDCghjb3VudGVycxgBIAMoCzInLmRpZ2l0YWxkZWx0YS5WZWN0b3JDbG'
    '9jay5Db3VudGVyc0VudHJ5Ughjb3VudGVycxo7Cg1Db3VudGVyc0VudHJ5EhAKA2tleRgBIAEo'
    'CVIDa2V5EhQKBXZhbHVlGAIgASgFUgV2YWx1ZToCOAE=');

@$core.Deprecated('Use gCounterDescriptor instead')
const GCounter$json = {
  '1': 'GCounter',
  '2': [
    {
      '1': 'increments',
      '3': 1,
      '4': 3,
      '5': 11,
      '6': '.digitaldelta.GCounter.IncrementsEntry',
      '10': 'increments'
    },
  ],
  '3': [GCounter_IncrementsEntry$json],
};

@$core.Deprecated('Use gCounterDescriptor instead')
const GCounter_IncrementsEntry$json = {
  '1': 'IncrementsEntry',
  '2': [
    {'1': 'key', '3': 1, '4': 1, '5': 9, '10': 'key'},
    {'1': 'value', '3': 2, '4': 1, '5': 5, '10': 'value'},
  ],
  '7': {'7': true},
};

/// Descriptor for `GCounter`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List gCounterDescriptor = $convert.base64Decode(
    'CghHQ291bnRlchJGCgppbmNyZW1lbnRzGAEgAygLMiYuZGlnaXRhbGRlbHRhLkdDb3VudGVyLk'
    'luY3JlbWVudHNFbnRyeVIKaW5jcmVtZW50cxo9Cg9JbmNyZW1lbnRzRW50cnkSEAoDa2V5GAEg'
    'ASgJUgNrZXkSFAoFdmFsdWUYAiABKAVSBXZhbHVlOgI4AQ==');

@$core.Deprecated('Use meshMetadataDescriptor instead')
const MeshMetadata$json = {
  '1': 'MeshMetadata',
  '2': [
    {'1': 'creator_node_id', '3': 1, '4': 1, '5': 9, '10': 'creatorNodeId'},
    {'1': 'signature', '3': 2, '4': 1, '5': 12, '10': 'signature'},
    {
      '1': 'clock',
      '3': 3,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.VectorClock',
      '10': 'clock'
    },
    {'1': 'timestamp', '3': 4, '4': 1, '5': 3, '10': 'timestamp'},
  ],
};

/// Descriptor for `MeshMetadata`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List meshMetadataDescriptor = $convert.base64Decode(
    'CgxNZXNoTWV0YWRhdGESJgoPY3JlYXRvcl9ub2RlX2lkGAEgASgJUg1jcmVhdG9yTm9kZUlkEh'
    'wKCXNpZ25hdHVyZRgCIAEoDFIJc2lnbmF0dXJlEi8KBWNsb2NrGAMgASgLMhkuZGlnaXRhbGRl'
    'bHRhLlZlY3RvckNsb2NrUgVjbG9jaxIcCgl0aW1lc3RhbXAYBCABKANSCXRpbWVzdGFtcA==');

@$core.Deprecated('Use triageRequestDescriptor instead')
const TriageRequest$json = {
  '1': 'TriageRequest',
  '2': [
    {'1': 'request_id', '3': 1, '4': 1, '5': 9, '10': 'requestId'},
    {'1': 'camp_node_id', '3': 2, '4': 1, '5': 9, '10': 'campNodeId'},
    {
      '1': 'category',
      '3': 3,
      '4': 1,
      '5': 14,
      '6': '.digitaldelta.ItemCategory',
      '10': 'category'
    },
    {
      '1': 'priority',
      '3': 4,
      '4': 1,
      '5': 14,
      '6': '.digitaldelta.Priority',
      '10': 'priority'
    },
    {'1': 'quantity_needed', '3': 5, '4': 1, '5': 5, '10': 'quantityNeeded'},
    {
      '1': 'meta',
      '3': 6,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `TriageRequest`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List triageRequestDescriptor = $convert.base64Decode(
    'Cg1UcmlhZ2VSZXF1ZXN0Eh0KCnJlcXVlc3RfaWQYASABKAlSCXJlcXVlc3RJZBIgCgxjYW1wX2'
    '5vZGVfaWQYAiABKAlSCmNhbXBOb2RlSWQSNgoIY2F0ZWdvcnkYAyABKA4yGi5kaWdpdGFsZGVs'
    'dGEuSXRlbUNhdGVnb3J5UghjYXRlZ29yeRIyCghwcmlvcml0eRgEIAEoDjIWLmRpZ2l0YWxkZW'
    'x0YS5Qcmlvcml0eVIIcHJpb3JpdHkSJwoPcXVhbnRpdHlfbmVlZGVkGAUgASgFUg5xdWFudGl0'
    'eU5lZWRlZBIuCgRtZXRhGAYgASgLMhouZGlnaXRhbGRlbHRhLk1lc2hNZXRhZGF0YVIEbWV0YQ'
    '==');

@$core.Deprecated('Use inventoryStockDescriptor instead')
const InventoryStock$json = {
  '1': 'InventoryStock',
  '2': [
    {'1': 'hub_id', '3': 1, '4': 1, '5': 9, '10': 'hubId'},
    {
      '1': 'category',
      '3': 2,
      '4': 1,
      '5': 14,
      '6': '.digitaldelta.ItemCategory',
      '10': 'category'
    },
    {'1': 'current_quantity', '3': 3, '4': 1, '5': 5, '10': 'currentQuantity'},
    {
      '1': 'meta',
      '3': 4,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `InventoryStock`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List inventoryStockDescriptor = $convert.base64Decode(
    'Cg5JbnZlbnRvcnlTdG9jaxIVCgZodWJfaWQYASABKAlSBWh1YklkEjYKCGNhdGVnb3J5GAIgAS'
    'gOMhouZGlnaXRhbGRlbHRhLkl0ZW1DYXRlZ29yeVIIY2F0ZWdvcnkSKQoQY3VycmVudF9xdWFu'
    'dGl0eRgDIAEoBVIPY3VycmVudFF1YW50aXR5Ei4KBG1ldGEYBCABKAsyGi5kaWdpdGFsZGVsdG'
    'EuTWVzaE1ldGFkYXRhUgRtZXRh');

@$core.Deprecated('Use roadStatusDescriptor instead')
const RoadStatus$json = {
  '1': 'RoadStatus',
  '2': [
    {'1': 'edge_id', '3': 1, '4': 1, '5': 9, '10': 'edgeId'},
    {'1': 'is_flooded', '3': 2, '4': 1, '5': 8, '10': 'isFlooded'},
    {
      '1': 'flood_probability',
      '3': 3,
      '4': 1,
      '5': 2,
      '10': 'floodProbability'
    },
    {'1': 'weight_penalty', '3': 4, '4': 1, '5': 5, '10': 'weightPenalty'},
    {
      '1': 'meta',
      '3': 5,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `RoadStatus`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List roadStatusDescriptor = $convert.base64Decode(
    'CgpSb2FkU3RhdHVzEhcKB2VkZ2VfaWQYASABKAlSBmVkZ2VJZBIdCgppc19mbG9vZGVkGAIgAS'
    'gIUglpc0Zsb29kZWQSKwoRZmxvb2RfcHJvYmFiaWxpdHkYAyABKAJSEGZsb29kUHJvYmFiaWxp'
    'dHkSJQoOd2VpZ2h0X3BlbmFsdHkYBCABKAVSDXdlaWdodFBlbmFsdHkSLgoEbWV0YRgFIAEoCz'
    'IaLmRpZ2l0YWxkZWx0YS5NZXNoTWV0YWRhdGFSBG1ldGE=');

@$core.Deprecated('Use chatMessageDescriptor instead')
const ChatMessage$json = {
  '1': 'ChatMessage',
  '2': [
    {'1': 'message_id', '3': 1, '4': 1, '5': 9, '10': 'messageId'},
    {'1': 'recipient_node_id', '3': 2, '4': 1, '5': 9, '10': 'recipientNodeId'},
    {'1': 'content', '3': 3, '4': 1, '5': 9, '10': 'content'},
    {
      '1': 'meta',
      '3': 4,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `ChatMessage`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List chatMessageDescriptor = $convert.base64Decode(
    'CgtDaGF0TWVzc2FnZRIdCgptZXNzYWdlX2lkGAEgASgJUgltZXNzYWdlSWQSKgoRcmVjaXBpZW'
    '50X25vZGVfaWQYAiABKAlSD3JlY2lwaWVudE5vZGVJZBIYCgdjb250ZW50GAMgASgJUgdjb250'
    'ZW50Ei4KBG1ldGEYBCABKAsyGi5kaWdpdGFsZGVsdGEuTWVzaE1ldGFkYXRhUgRtZXRh');

@$core.Deprecated('Use deliveryTaskDescriptor instead')
const DeliveryTask$json = {
  '1': 'DeliveryTask',
  '2': [
    {'1': 'task_id', '3': 1, '4': 1, '5': 9, '10': 'taskId'},
    {'1': 'current_holder_id', '3': 2, '4': 1, '5': 9, '10': 'currentHolderId'},
    {
      '1': 'original_request',
      '3': 3,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.TriageRequest',
      '10': 'originalRequest'
    },
    {
      '1': 'status',
      '3': 4,
      '4': 1,
      '5': 14,
      '6': '.digitaldelta.TaskStatus',
      '10': 'status'
    },
    {
      '1': 'manager_signature',
      '3': 5,
      '4': 1,
      '5': 12,
      '10': 'managerSignature'
    },
    {
      '1': 'camp_commander_sig',
      '3': 6,
      '4': 1,
      '5': 12,
      '10': 'campCommanderSig'
    },
    {
      '1': 'drone_operator_sig',
      '3': 7,
      '4': 1,
      '5': 12,
      '10': 'droneOperatorSig'
    },
    {
      '1': 'meta',
      '3': 8,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `DeliveryTask`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List deliveryTaskDescriptor = $convert.base64Decode(
    'CgxEZWxpdmVyeVRhc2sSFwoHdGFza19pZBgBIAEoCVIGdGFza0lkEioKEWN1cnJlbnRfaG9sZG'
    'VyX2lkGAIgASgJUg9jdXJyZW50SG9sZGVySWQSRgoQb3JpZ2luYWxfcmVxdWVzdBgDIAEoCzIb'
    'LmRpZ2l0YWxkZWx0YS5UcmlhZ2VSZXF1ZXN0Ug9vcmlnaW5hbFJlcXVlc3QSMAoGc3RhdHVzGA'
    'QgASgOMhguZGlnaXRhbGRlbHRhLlRhc2tTdGF0dXNSBnN0YXR1cxIrChFtYW5hZ2VyX3NpZ25h'
    'dHVyZRgFIAEoDFIQbWFuYWdlclNpZ25hdHVyZRIsChJjYW1wX2NvbW1hbmRlcl9zaWcYBiABKA'
    'xSEGNhbXBDb21tYW5kZXJTaWcSLAoSZHJvbmVfb3BlcmF0b3Jfc2lnGAcgASgMUhBkcm9uZU9w'
    'ZXJhdG9yU2lnEi4KBG1ldGEYCCABKAsyGi5kaWdpdGFsZGVsdGEuTWVzaE1ldGFkYXRhUgRtZX'
    'Rh');

@$core.Deprecated('Use syncEnvelopeDescriptor instead')
const SyncEnvelope$json = {
  '1': 'SyncEnvelope',
  '2': [
    {'1': 'sender_node_id', '3': 1, '4': 1, '5': 9, '10': 'senderNodeId'},
    {
      '1': 'sender_public_key',
      '3': 2,
      '4': 1,
      '5': 12,
      '10': 'senderPublicKey'
    },
    {
      '1': 'resource_counter',
      '3': 10,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.GCounter',
      '9': 1,
      '10': 'resourceCounter',
      '17': true
    },
    {
      '1': 'triage_update',
      '3': 3,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.TriageRequest',
      '9': 0,
      '10': 'triageUpdate'
    },
    {
      '1': 'inventory_update',
      '3': 4,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.InventoryStock',
      '9': 0,
      '10': 'inventoryUpdate'
    },
    {
      '1': 'road_update',
      '3': 5,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.RoadStatus',
      '9': 0,
      '10': 'roadUpdate'
    },
    {
      '1': 'task_update',
      '3': 6,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.DeliveryTask',
      '9': 0,
      '10': 'taskUpdate'
    },
    {
      '1': 'registration',
      '3': 7,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.UserIdentity',
      '9': 0,
      '10': 'registration'
    },
    {
      '1': 'chat_update',
      '3': 8,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.ChatMessage',
      '9': 0,
      '10': 'chatUpdate'
    },
  ],
  '8': [
    {'1': 'payload'},
    {'1': '_resource_counter'},
  ],
};

/// Descriptor for `SyncEnvelope`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List syncEnvelopeDescriptor = $convert.base64Decode(
    'CgxTeW5jRW52ZWxvcGUSJAoOc2VuZGVyX25vZGVfaWQYASABKAlSDHNlbmRlck5vZGVJZBIqCh'
    'FzZW5kZXJfcHVibGljX2tleRgCIAEoDFIPc2VuZGVyUHVibGljS2V5EkYKEHJlc291cmNlX2Nv'
    'dW50ZXIYCiABKAsyFi5kaWdpdGFsZGVsdGEuR0NvdW50ZXJIAVIPcmVzb3VyY2VDb3VudGVyiA'
    'EBEkIKDXRyaWFnZV91cGRhdGUYAyABKAsyGy5kaWdpdGFsZGVsdGEuVHJpYWdlUmVxdWVzdEgA'
    'Ugx0cmlhZ2VVcGRhdGUSSQoQaW52ZW50b3J5X3VwZGF0ZRgEIAEoCzIcLmRpZ2l0YWxkZWx0YS'
    '5JbnZlbnRvcnlTdG9ja0gAUg9pbnZlbnRvcnlVcGRhdGUSOwoLcm9hZF91cGRhdGUYBSABKAsy'
    'GC5kaWdpdGFsZGVsdGEuUm9hZFN0YXR1c0gAUgpyb2FkVXBkYXRlEj0KC3Rhc2tfdXBkYXRlGA'
    'YgASgLMhouZGlnaXRhbGRlbHRhLkRlbGl2ZXJ5VGFza0gAUgp0YXNrVXBkYXRlEkAKDHJlZ2lz'
    'dHJhdGlvbhgHIAEoCzIaLmRpZ2l0YWxkZWx0YS5Vc2VySWRlbnRpdHlIAFIMcmVnaXN0cmF0aW'
    '9uEjwKC2NoYXRfdXBkYXRlGAggASgLMhkuZGlnaXRhbGRlbHRhLkNoYXRNZXNzYWdlSABSCmNo'
    'YXRVcGRhdGVCCQoHcGF5bG9hZEITChFfcmVzb3VyY2VfY291bnRlcg==');

@$core.Deprecated('Use userIdentityDescriptor instead')
const UserIdentity$json = {
  '1': 'UserIdentity',
  '2': [
    {'1': 'node_id', '3': 1, '4': 1, '5': 9, '10': 'nodeId'},
    {
      '1': 'role',
      '3': 2,
      '4': 1,
      '5': 14,
      '6': '.digitaldelta.Role',
      '10': 'role'
    },
    {'1': 'display_name', '3': 3, '4': 1, '5': 9, '10': 'displayName'},
    {'1': 'public_key', '3': 4, '4': 1, '5': 12, '10': 'publicKey'},
    {
      '1': 'meta',
      '3': 5,
      '4': 1,
      '5': 11,
      '6': '.digitaldelta.MeshMetadata',
      '10': 'meta'
    },
  ],
};

/// Descriptor for `UserIdentity`. Decode as a `google.protobuf.DescriptorProto`.
final $typed_data.Uint8List userIdentityDescriptor = $convert.base64Decode(
    'CgxVc2VySWRlbnRpdHkSFwoHbm9kZV9pZBgBIAEoCVIGbm9kZUlkEiYKBHJvbGUYAiABKA4yEi'
    '5kaWdpdGFsZGVsdGEuUm9sZVIEcm9sZRIhCgxkaXNwbGF5X25hbWUYAyABKAlSC2Rpc3BsYXlO'
    'YW1lEh0KCnB1YmxpY19rZXkYBCABKAxSCXB1YmxpY0tleRIuCgRtZXRhGAUgASgLMhouZGlnaX'
    'RhbGRlbHRhLk1lc2hNZXRhZGF0YVIEbWV0YQ==');
