/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.digitaldelta = (function() {

    /**
     * Namespace digitaldelta.
     * @exports digitaldelta
     * @namespace
     */
    var digitaldelta = {};

    /**
     * Role enum.
     * @name digitaldelta.Role
     * @enum {number}
     * @property {number} ROLE_UNSPECIFIED=0 ROLE_UNSPECIFIED value
     * @property {number} FIELD_VOLUNTEER=1 FIELD_VOLUNTEER value
     * @property {number} SUPPLY_MANAGER=2 SUPPLY_MANAGER value
     * @property {number} DRONE_OPERATOR=3 DRONE_OPERATOR value
     * @property {number} CAMP_COMMANDER=4 CAMP_COMMANDER value
     * @property {number} SYNC_ADMIN=5 SYNC_ADMIN value
     */
    digitaldelta.Role = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ROLE_UNSPECIFIED"] = 0;
        values[valuesById[1] = "FIELD_VOLUNTEER"] = 1;
        values[valuesById[2] = "SUPPLY_MANAGER"] = 2;
        values[valuesById[3] = "DRONE_OPERATOR"] = 3;
        values[valuesById[4] = "CAMP_COMMANDER"] = 4;
        values[valuesById[5] = "SYNC_ADMIN"] = 5;
        return values;
    })();

    /**
     * ItemCategory enum.
     * @name digitaldelta.ItemCategory
     * @enum {number}
     * @property {number} CAT_UNSPECIFIED=0 CAT_UNSPECIFIED value
     * @property {number} MEDICINE=1 MEDICINE value
     * @property {number} FOODS=2 FOODS value
     * @property {number} CLOTHS=3 CLOTHS value
     * @property {number} WATER=4 WATER value
     */
    digitaldelta.ItemCategory = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "CAT_UNSPECIFIED"] = 0;
        values[valuesById[1] = "MEDICINE"] = 1;
        values[valuesById[2] = "FOODS"] = 2;
        values[valuesById[3] = "CLOTHS"] = 3;
        values[valuesById[4] = "WATER"] = 4;
        return values;
    })();

    /**
     * Priority enum.
     * @name digitaldelta.Priority
     * @enum {number}
     * @property {number} P3_LOW=0 P3_LOW value
     * @property {number} P2_STANDARD=1 P2_STANDARD value
     * @property {number} P1_HIGH=2 P1_HIGH value
     * @property {number} P0_CRITICAL=3 P0_CRITICAL value
     */
    digitaldelta.Priority = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "P3_LOW"] = 0;
        values[valuesById[1] = "P2_STANDARD"] = 1;
        values[valuesById[2] = "P1_HIGH"] = 2;
        values[valuesById[3] = "P0_CRITICAL"] = 3;
        return values;
    })();

    /**
     * TaskStatus enum.
     * @name digitaldelta.TaskStatus
     * @enum {number}
     * @property {number} PENDING=0 PENDING value
     * @property {number} ASSIGNED=1 ASSIGNED value
     * @property {number} IN_TRANSIT=2 IN_TRANSIT value
     * @property {number} HANDOFF_IN_PROGRESS=3 HANDOFF_IN_PROGRESS value
     * @property {number} DELIVERED=4 DELIVERED value
     */
    digitaldelta.TaskStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PENDING"] = 0;
        values[valuesById[1] = "ASSIGNED"] = 1;
        values[valuesById[2] = "IN_TRANSIT"] = 2;
        values[valuesById[3] = "HANDOFF_IN_PROGRESS"] = 3;
        values[valuesById[4] = "DELIVERED"] = 4;
        return values;
    })();

    digitaldelta.VectorClock = (function() {

        /**
         * Properties of a VectorClock.
         * @memberof digitaldelta
         * @interface IVectorClock
         * @property {Object.<string,number>|null} [counters] VectorClock counters
         */

        /**
         * Constructs a new VectorClock.
         * @memberof digitaldelta
         * @classdesc Represents a VectorClock.
         * @implements IVectorClock
         * @constructor
         * @param {digitaldelta.IVectorClock=} [properties] Properties to set
         */
        function VectorClock(properties) {
            this.counters = {};
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VectorClock counters.
         * @member {Object.<string,number>} counters
         * @memberof digitaldelta.VectorClock
         * @instance
         */
        VectorClock.prototype.counters = $util.emptyObject;

        /**
         * Creates a new VectorClock instance using the specified properties.
         * @function create
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {digitaldelta.IVectorClock=} [properties] Properties to set
         * @returns {digitaldelta.VectorClock} VectorClock instance
         */
        VectorClock.create = function create(properties) {
            return new VectorClock(properties);
        };

        /**
         * Encodes the specified VectorClock message. Does not implicitly {@link digitaldelta.VectorClock.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {digitaldelta.IVectorClock} message VectorClock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorClock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.counters != null && Object.hasOwnProperty.call(message, "counters"))
                for (var keys = Object.keys(message.counters), i = 0; i < keys.length; ++i)
                    writer.uint32(/* id 1, wireType 2 =*/10).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 0 =*/16).int32(message.counters[keys[i]]).ldelim();
            return writer;
        };

        /**
         * Encodes the specified VectorClock message, length delimited. Does not implicitly {@link digitaldelta.VectorClock.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {digitaldelta.IVectorClock} message VectorClock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VectorClock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VectorClock message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.VectorClock} VectorClock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorClock.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.VectorClock(), key, value;
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (message.counters === $util.emptyObject)
                            message.counters = {};
                        var end2 = reader.uint32() + reader.pos;
                        key = "";
                        value = 0;
                        while (reader.pos < end2) {
                            var tag2 = reader.uint32();
                            switch (tag2 >>> 3) {
                            case 1:
                                key = reader.string();
                                break;
                            case 2:
                                value = reader.int32();
                                break;
                            default:
                                reader.skipType(tag2 & 7);
                                break;
                            }
                        }
                        message.counters[key] = value;
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VectorClock message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.VectorClock} VectorClock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VectorClock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VectorClock message.
         * @function verify
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VectorClock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.counters != null && message.hasOwnProperty("counters")) {
                if (!$util.isObject(message.counters))
                    return "counters: object expected";
                var key = Object.keys(message.counters);
                for (var i = 0; i < key.length; ++i)
                    if (!$util.isInteger(message.counters[key[i]]))
                        return "counters: integer{k:string} expected";
            }
            return null;
        };

        /**
         * Creates a VectorClock message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.VectorClock} VectorClock
         */
        VectorClock.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.VectorClock)
                return object;
            var message = new $root.digitaldelta.VectorClock();
            if (object.counters) {
                if (typeof object.counters !== "object")
                    throw TypeError(".digitaldelta.VectorClock.counters: object expected");
                message.counters = {};
                for (var keys = Object.keys(object.counters), i = 0; i < keys.length; ++i)
                    message.counters[keys[i]] = object.counters[keys[i]] | 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a VectorClock message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {digitaldelta.VectorClock} message VectorClock
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VectorClock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.objects || options.defaults)
                object.counters = {};
            var keys2;
            if (message.counters && (keys2 = Object.keys(message.counters)).length) {
                object.counters = {};
                for (var j = 0; j < keys2.length; ++j)
                    object.counters[keys2[j]] = message.counters[keys2[j]];
            }
            return object;
        };

        /**
         * Converts this VectorClock to JSON.
         * @function toJSON
         * @memberof digitaldelta.VectorClock
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VectorClock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VectorClock
         * @function getTypeUrl
         * @memberof digitaldelta.VectorClock
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VectorClock.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.VectorClock";
        };

        return VectorClock;
    })();

    digitaldelta.MeshMetadata = (function() {

        /**
         * Properties of a MeshMetadata.
         * @memberof digitaldelta
         * @interface IMeshMetadata
         * @property {string|null} [creatorNodeId] MeshMetadata creatorNodeId
         * @property {Uint8Array|null} [signature] MeshMetadata signature
         * @property {digitaldelta.IVectorClock|null} [clock] MeshMetadata clock
         * @property {number|Long|null} [timestamp] MeshMetadata timestamp
         */

        /**
         * Constructs a new MeshMetadata.
         * @memberof digitaldelta
         * @classdesc Represents a MeshMetadata.
         * @implements IMeshMetadata
         * @constructor
         * @param {digitaldelta.IMeshMetadata=} [properties] Properties to set
         */
        function MeshMetadata(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MeshMetadata creatorNodeId.
         * @member {string} creatorNodeId
         * @memberof digitaldelta.MeshMetadata
         * @instance
         */
        MeshMetadata.prototype.creatorNodeId = "";

        /**
         * MeshMetadata signature.
         * @member {Uint8Array} signature
         * @memberof digitaldelta.MeshMetadata
         * @instance
         */
        MeshMetadata.prototype.signature = $util.newBuffer([]);

        /**
         * MeshMetadata clock.
         * @member {digitaldelta.IVectorClock|null|undefined} clock
         * @memberof digitaldelta.MeshMetadata
         * @instance
         */
        MeshMetadata.prototype.clock = null;

        /**
         * MeshMetadata timestamp.
         * @member {number|Long} timestamp
         * @memberof digitaldelta.MeshMetadata
         * @instance
         */
        MeshMetadata.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new MeshMetadata instance using the specified properties.
         * @function create
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {digitaldelta.IMeshMetadata=} [properties] Properties to set
         * @returns {digitaldelta.MeshMetadata} MeshMetadata instance
         */
        MeshMetadata.create = function create(properties) {
            return new MeshMetadata(properties);
        };

        /**
         * Encodes the specified MeshMetadata message. Does not implicitly {@link digitaldelta.MeshMetadata.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {digitaldelta.IMeshMetadata} message MeshMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MeshMetadata.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.creatorNodeId != null && Object.hasOwnProperty.call(message, "creatorNodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.creatorNodeId);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.signature);
            if (message.clock != null && Object.hasOwnProperty.call(message, "clock"))
                $root.digitaldelta.VectorClock.encode(message.clock, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.timestamp);
            return writer;
        };

        /**
         * Encodes the specified MeshMetadata message, length delimited. Does not implicitly {@link digitaldelta.MeshMetadata.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {digitaldelta.IMeshMetadata} message MeshMetadata message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MeshMetadata.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MeshMetadata message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.MeshMetadata} MeshMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MeshMetadata.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.MeshMetadata();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.creatorNodeId = reader.string();
                        break;
                    }
                case 2: {
                        message.signature = reader.bytes();
                        break;
                    }
                case 3: {
                        message.clock = $root.digitaldelta.VectorClock.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.timestamp = reader.int64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MeshMetadata message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.MeshMetadata} MeshMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MeshMetadata.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MeshMetadata message.
         * @function verify
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MeshMetadata.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.creatorNodeId != null && message.hasOwnProperty("creatorNodeId"))
                if (!$util.isString(message.creatorNodeId))
                    return "creatorNodeId: string expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            if (message.clock != null && message.hasOwnProperty("clock")) {
                var error = $root.digitaldelta.VectorClock.verify(message.clock);
                if (error)
                    return "clock." + error;
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            return null;
        };

        /**
         * Creates a MeshMetadata message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.MeshMetadata} MeshMetadata
         */
        MeshMetadata.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.MeshMetadata)
                return object;
            var message = new $root.digitaldelta.MeshMetadata();
            if (object.creatorNodeId != null)
                message.creatorNodeId = String(object.creatorNodeId);
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length >= 0)
                    message.signature = object.signature;
            if (object.clock != null) {
                if (typeof object.clock !== "object")
                    throw TypeError(".digitaldelta.MeshMetadata.clock: object expected");
                message.clock = $root.digitaldelta.VectorClock.fromObject(object.clock);
            }
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a MeshMetadata message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {digitaldelta.MeshMetadata} message MeshMetadata
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MeshMetadata.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.creatorNodeId = "";
                if (options.bytes === String)
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
                object.clock = null;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
            }
            if (message.creatorNodeId != null && message.hasOwnProperty("creatorNodeId"))
                object.creatorNodeId = message.creatorNodeId;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            if (message.clock != null && message.hasOwnProperty("clock"))
                object.clock = $root.digitaldelta.VectorClock.toObject(message.clock, options);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
            return object;
        };

        /**
         * Converts this MeshMetadata to JSON.
         * @function toJSON
         * @memberof digitaldelta.MeshMetadata
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MeshMetadata.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for MeshMetadata
         * @function getTypeUrl
         * @memberof digitaldelta.MeshMetadata
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        MeshMetadata.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.MeshMetadata";
        };

        return MeshMetadata;
    })();

    digitaldelta.TriageRequest = (function() {

        /**
         * Properties of a TriageRequest.
         * @memberof digitaldelta
         * @interface ITriageRequest
         * @property {string|null} [requestId] TriageRequest requestId
         * @property {string|null} [campNodeId] TriageRequest campNodeId
         * @property {digitaldelta.ItemCategory|null} [category] TriageRequest category
         * @property {digitaldelta.Priority|null} [priority] TriageRequest priority
         * @property {number|null} [quantityNeeded] TriageRequest quantityNeeded
         * @property {digitaldelta.IMeshMetadata|null} [meta] TriageRequest meta
         */

        /**
         * Constructs a new TriageRequest.
         * @memberof digitaldelta
         * @classdesc Represents a TriageRequest.
         * @implements ITriageRequest
         * @constructor
         * @param {digitaldelta.ITriageRequest=} [properties] Properties to set
         */
        function TriageRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TriageRequest requestId.
         * @member {string} requestId
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.requestId = "";

        /**
         * TriageRequest campNodeId.
         * @member {string} campNodeId
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.campNodeId = "";

        /**
         * TriageRequest category.
         * @member {digitaldelta.ItemCategory} category
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.category = 0;

        /**
         * TriageRequest priority.
         * @member {digitaldelta.Priority} priority
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.priority = 0;

        /**
         * TriageRequest quantityNeeded.
         * @member {number} quantityNeeded
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.quantityNeeded = 0;

        /**
         * TriageRequest meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.TriageRequest
         * @instance
         */
        TriageRequest.prototype.meta = null;

        /**
         * Creates a new TriageRequest instance using the specified properties.
         * @function create
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {digitaldelta.ITriageRequest=} [properties] Properties to set
         * @returns {digitaldelta.TriageRequest} TriageRequest instance
         */
        TriageRequest.create = function create(properties) {
            return new TriageRequest(properties);
        };

        /**
         * Encodes the specified TriageRequest message. Does not implicitly {@link digitaldelta.TriageRequest.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {digitaldelta.ITriageRequest} message TriageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TriageRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.requestId != null && Object.hasOwnProperty.call(message, "requestId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.requestId);
            if (message.campNodeId != null && Object.hasOwnProperty.call(message, "campNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.campNodeId);
            if (message.category != null && Object.hasOwnProperty.call(message, "category"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.category);
            if (message.priority != null && Object.hasOwnProperty.call(message, "priority"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.priority);
            if (message.quantityNeeded != null && Object.hasOwnProperty.call(message, "quantityNeeded"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.quantityNeeded);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TriageRequest message, length delimited. Does not implicitly {@link digitaldelta.TriageRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {digitaldelta.ITriageRequest} message TriageRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TriageRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TriageRequest message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.TriageRequest} TriageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TriageRequest.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.TriageRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.requestId = reader.string();
                        break;
                    }
                case 2: {
                        message.campNodeId = reader.string();
                        break;
                    }
                case 3: {
                        message.category = reader.int32();
                        break;
                    }
                case 4: {
                        message.priority = reader.int32();
                        break;
                    }
                case 5: {
                        message.quantityNeeded = reader.int32();
                        break;
                    }
                case 6: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TriageRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.TriageRequest} TriageRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TriageRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TriageRequest message.
         * @function verify
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TriageRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                if (!$util.isString(message.requestId))
                    return "requestId: string expected";
            if (message.campNodeId != null && message.hasOwnProperty("campNodeId"))
                if (!$util.isString(message.campNodeId))
                    return "campNodeId: string expected";
            if (message.category != null && message.hasOwnProperty("category"))
                switch (message.category) {
                default:
                    return "category: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.priority != null && message.hasOwnProperty("priority"))
                switch (message.priority) {
                default:
                    return "priority: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.quantityNeeded != null && message.hasOwnProperty("quantityNeeded"))
                if (!$util.isInteger(message.quantityNeeded))
                    return "quantityNeeded: integer expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates a TriageRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.TriageRequest} TriageRequest
         */
        TriageRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.TriageRequest)
                return object;
            var message = new $root.digitaldelta.TriageRequest();
            if (object.requestId != null)
                message.requestId = String(object.requestId);
            if (object.campNodeId != null)
                message.campNodeId = String(object.campNodeId);
            switch (object.category) {
            default:
                if (typeof object.category === "number") {
                    message.category = object.category;
                    break;
                }
                break;
            case "CAT_UNSPECIFIED":
            case 0:
                message.category = 0;
                break;
            case "MEDICINE":
            case 1:
                message.category = 1;
                break;
            case "FOODS":
            case 2:
                message.category = 2;
                break;
            case "CLOTHS":
            case 3:
                message.category = 3;
                break;
            case "WATER":
            case 4:
                message.category = 4;
                break;
            }
            switch (object.priority) {
            default:
                if (typeof object.priority === "number") {
                    message.priority = object.priority;
                    break;
                }
                break;
            case "P3_LOW":
            case 0:
                message.priority = 0;
                break;
            case "P2_STANDARD":
            case 1:
                message.priority = 1;
                break;
            case "P1_HIGH":
            case 2:
                message.priority = 2;
                break;
            case "P0_CRITICAL":
            case 3:
                message.priority = 3;
                break;
            }
            if (object.quantityNeeded != null)
                message.quantityNeeded = object.quantityNeeded | 0;
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.TriageRequest.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from a TriageRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {digitaldelta.TriageRequest} message TriageRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TriageRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.requestId = "";
                object.campNodeId = "";
                object.category = options.enums === String ? "CAT_UNSPECIFIED" : 0;
                object.priority = options.enums === String ? "P3_LOW" : 0;
                object.quantityNeeded = 0;
                object.meta = null;
            }
            if (message.requestId != null && message.hasOwnProperty("requestId"))
                object.requestId = message.requestId;
            if (message.campNodeId != null && message.hasOwnProperty("campNodeId"))
                object.campNodeId = message.campNodeId;
            if (message.category != null && message.hasOwnProperty("category"))
                object.category = options.enums === String ? $root.digitaldelta.ItemCategory[message.category] === undefined ? message.category : $root.digitaldelta.ItemCategory[message.category] : message.category;
            if (message.priority != null && message.hasOwnProperty("priority"))
                object.priority = options.enums === String ? $root.digitaldelta.Priority[message.priority] === undefined ? message.priority : $root.digitaldelta.Priority[message.priority] : message.priority;
            if (message.quantityNeeded != null && message.hasOwnProperty("quantityNeeded"))
                object.quantityNeeded = message.quantityNeeded;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this TriageRequest to JSON.
         * @function toJSON
         * @memberof digitaldelta.TriageRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TriageRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TriageRequest
         * @function getTypeUrl
         * @memberof digitaldelta.TriageRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TriageRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.TriageRequest";
        };

        return TriageRequest;
    })();

    digitaldelta.InventoryStock = (function() {

        /**
         * Properties of an InventoryStock.
         * @memberof digitaldelta
         * @interface IInventoryStock
         * @property {string|null} [hubId] InventoryStock hubId
         * @property {digitaldelta.ItemCategory|null} [category] InventoryStock category
         * @property {number|null} [currentQuantity] InventoryStock currentQuantity
         * @property {digitaldelta.IMeshMetadata|null} [meta] InventoryStock meta
         */

        /**
         * Constructs a new InventoryStock.
         * @memberof digitaldelta
         * @classdesc Represents an InventoryStock.
         * @implements IInventoryStock
         * @constructor
         * @param {digitaldelta.IInventoryStock=} [properties] Properties to set
         */
        function InventoryStock(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InventoryStock hubId.
         * @member {string} hubId
         * @memberof digitaldelta.InventoryStock
         * @instance
         */
        InventoryStock.prototype.hubId = "";

        /**
         * InventoryStock category.
         * @member {digitaldelta.ItemCategory} category
         * @memberof digitaldelta.InventoryStock
         * @instance
         */
        InventoryStock.prototype.category = 0;

        /**
         * InventoryStock currentQuantity.
         * @member {number} currentQuantity
         * @memberof digitaldelta.InventoryStock
         * @instance
         */
        InventoryStock.prototype.currentQuantity = 0;

        /**
         * InventoryStock meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.InventoryStock
         * @instance
         */
        InventoryStock.prototype.meta = null;

        /**
         * Creates a new InventoryStock instance using the specified properties.
         * @function create
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {digitaldelta.IInventoryStock=} [properties] Properties to set
         * @returns {digitaldelta.InventoryStock} InventoryStock instance
         */
        InventoryStock.create = function create(properties) {
            return new InventoryStock(properties);
        };

        /**
         * Encodes the specified InventoryStock message. Does not implicitly {@link digitaldelta.InventoryStock.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {digitaldelta.IInventoryStock} message InventoryStock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InventoryStock.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hubId != null && Object.hasOwnProperty.call(message, "hubId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.hubId);
            if (message.category != null && Object.hasOwnProperty.call(message, "category"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.category);
            if (message.currentQuantity != null && Object.hasOwnProperty.call(message, "currentQuantity"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.currentQuantity);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified InventoryStock message, length delimited. Does not implicitly {@link digitaldelta.InventoryStock.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {digitaldelta.IInventoryStock} message InventoryStock message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InventoryStock.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InventoryStock message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.InventoryStock} InventoryStock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InventoryStock.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.InventoryStock();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.hubId = reader.string();
                        break;
                    }
                case 2: {
                        message.category = reader.int32();
                        break;
                    }
                case 3: {
                        message.currentQuantity = reader.int32();
                        break;
                    }
                case 4: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InventoryStock message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.InventoryStock} InventoryStock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InventoryStock.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InventoryStock message.
         * @function verify
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InventoryStock.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hubId != null && message.hasOwnProperty("hubId"))
                if (!$util.isString(message.hubId))
                    return "hubId: string expected";
            if (message.category != null && message.hasOwnProperty("category"))
                switch (message.category) {
                default:
                    return "category: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.currentQuantity != null && message.hasOwnProperty("currentQuantity"))
                if (!$util.isInteger(message.currentQuantity))
                    return "currentQuantity: integer expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates an InventoryStock message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.InventoryStock} InventoryStock
         */
        InventoryStock.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.InventoryStock)
                return object;
            var message = new $root.digitaldelta.InventoryStock();
            if (object.hubId != null)
                message.hubId = String(object.hubId);
            switch (object.category) {
            default:
                if (typeof object.category === "number") {
                    message.category = object.category;
                    break;
                }
                break;
            case "CAT_UNSPECIFIED":
            case 0:
                message.category = 0;
                break;
            case "MEDICINE":
            case 1:
                message.category = 1;
                break;
            case "FOODS":
            case 2:
                message.category = 2;
                break;
            case "CLOTHS":
            case 3:
                message.category = 3;
                break;
            case "WATER":
            case 4:
                message.category = 4;
                break;
            }
            if (object.currentQuantity != null)
                message.currentQuantity = object.currentQuantity | 0;
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.InventoryStock.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from an InventoryStock message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {digitaldelta.InventoryStock} message InventoryStock
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InventoryStock.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.hubId = "";
                object.category = options.enums === String ? "CAT_UNSPECIFIED" : 0;
                object.currentQuantity = 0;
                object.meta = null;
            }
            if (message.hubId != null && message.hasOwnProperty("hubId"))
                object.hubId = message.hubId;
            if (message.category != null && message.hasOwnProperty("category"))
                object.category = options.enums === String ? $root.digitaldelta.ItemCategory[message.category] === undefined ? message.category : $root.digitaldelta.ItemCategory[message.category] : message.category;
            if (message.currentQuantity != null && message.hasOwnProperty("currentQuantity"))
                object.currentQuantity = message.currentQuantity;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this InventoryStock to JSON.
         * @function toJSON
         * @memberof digitaldelta.InventoryStock
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InventoryStock.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for InventoryStock
         * @function getTypeUrl
         * @memberof digitaldelta.InventoryStock
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        InventoryStock.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.InventoryStock";
        };

        return InventoryStock;
    })();

    digitaldelta.RoadStatus = (function() {

        /**
         * Properties of a RoadStatus.
         * @memberof digitaldelta
         * @interface IRoadStatus
         * @property {string|null} [edgeId] RoadStatus edgeId
         * @property {boolean|null} [isFlooded] RoadStatus isFlooded
         * @property {number|null} [floodProbability] RoadStatus floodProbability
         * @property {number|null} [weightPenalty] RoadStatus weightPenalty
         * @property {digitaldelta.IMeshMetadata|null} [meta] RoadStatus meta
         */

        /**
         * Constructs a new RoadStatus.
         * @memberof digitaldelta
         * @classdesc Represents a RoadStatus.
         * @implements IRoadStatus
         * @constructor
         * @param {digitaldelta.IRoadStatus=} [properties] Properties to set
         */
        function RoadStatus(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RoadStatus edgeId.
         * @member {string} edgeId
         * @memberof digitaldelta.RoadStatus
         * @instance
         */
        RoadStatus.prototype.edgeId = "";

        /**
         * RoadStatus isFlooded.
         * @member {boolean} isFlooded
         * @memberof digitaldelta.RoadStatus
         * @instance
         */
        RoadStatus.prototype.isFlooded = false;

        /**
         * RoadStatus floodProbability.
         * @member {number} floodProbability
         * @memberof digitaldelta.RoadStatus
         * @instance
         */
        RoadStatus.prototype.floodProbability = 0;

        /**
         * RoadStatus weightPenalty.
         * @member {number} weightPenalty
         * @memberof digitaldelta.RoadStatus
         * @instance
         */
        RoadStatus.prototype.weightPenalty = 0;

        /**
         * RoadStatus meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.RoadStatus
         * @instance
         */
        RoadStatus.prototype.meta = null;

        /**
         * Creates a new RoadStatus instance using the specified properties.
         * @function create
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {digitaldelta.IRoadStatus=} [properties] Properties to set
         * @returns {digitaldelta.RoadStatus} RoadStatus instance
         */
        RoadStatus.create = function create(properties) {
            return new RoadStatus(properties);
        };

        /**
         * Encodes the specified RoadStatus message. Does not implicitly {@link digitaldelta.RoadStatus.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {digitaldelta.IRoadStatus} message RoadStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoadStatus.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.edgeId != null && Object.hasOwnProperty.call(message, "edgeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.edgeId);
            if (message.isFlooded != null && Object.hasOwnProperty.call(message, "isFlooded"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isFlooded);
            if (message.floodProbability != null && Object.hasOwnProperty.call(message, "floodProbability"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.floodProbability);
            if (message.weightPenalty != null && Object.hasOwnProperty.call(message, "weightPenalty"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.weightPenalty);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified RoadStatus message, length delimited. Does not implicitly {@link digitaldelta.RoadStatus.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {digitaldelta.IRoadStatus} message RoadStatus message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RoadStatus.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RoadStatus message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.RoadStatus} RoadStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoadStatus.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.RoadStatus();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.edgeId = reader.string();
                        break;
                    }
                case 2: {
                        message.isFlooded = reader.bool();
                        break;
                    }
                case 3: {
                        message.floodProbability = reader.float();
                        break;
                    }
                case 4: {
                        message.weightPenalty = reader.int32();
                        break;
                    }
                case 5: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RoadStatus message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.RoadStatus} RoadStatus
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RoadStatus.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RoadStatus message.
         * @function verify
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RoadStatus.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.edgeId != null && message.hasOwnProperty("edgeId"))
                if (!$util.isString(message.edgeId))
                    return "edgeId: string expected";
            if (message.isFlooded != null && message.hasOwnProperty("isFlooded"))
                if (typeof message.isFlooded !== "boolean")
                    return "isFlooded: boolean expected";
            if (message.floodProbability != null && message.hasOwnProperty("floodProbability"))
                if (typeof message.floodProbability !== "number")
                    return "floodProbability: number expected";
            if (message.weightPenalty != null && message.hasOwnProperty("weightPenalty"))
                if (!$util.isInteger(message.weightPenalty))
                    return "weightPenalty: integer expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates a RoadStatus message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.RoadStatus} RoadStatus
         */
        RoadStatus.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.RoadStatus)
                return object;
            var message = new $root.digitaldelta.RoadStatus();
            if (object.edgeId != null)
                message.edgeId = String(object.edgeId);
            if (object.isFlooded != null)
                message.isFlooded = Boolean(object.isFlooded);
            if (object.floodProbability != null)
                message.floodProbability = Number(object.floodProbability);
            if (object.weightPenalty != null)
                message.weightPenalty = object.weightPenalty | 0;
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.RoadStatus.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from a RoadStatus message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {digitaldelta.RoadStatus} message RoadStatus
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RoadStatus.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.edgeId = "";
                object.isFlooded = false;
                object.floodProbability = 0;
                object.weightPenalty = 0;
                object.meta = null;
            }
            if (message.edgeId != null && message.hasOwnProperty("edgeId"))
                object.edgeId = message.edgeId;
            if (message.isFlooded != null && message.hasOwnProperty("isFlooded"))
                object.isFlooded = message.isFlooded;
            if (message.floodProbability != null && message.hasOwnProperty("floodProbability"))
                object.floodProbability = options.json && !isFinite(message.floodProbability) ? String(message.floodProbability) : message.floodProbability;
            if (message.weightPenalty != null && message.hasOwnProperty("weightPenalty"))
                object.weightPenalty = message.weightPenalty;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this RoadStatus to JSON.
         * @function toJSON
         * @memberof digitaldelta.RoadStatus
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RoadStatus.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for RoadStatus
         * @function getTypeUrl
         * @memberof digitaldelta.RoadStatus
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        RoadStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.RoadStatus";
        };

        return RoadStatus;
    })();

    digitaldelta.ChatMessage = (function() {

        /**
         * Properties of a ChatMessage.
         * @memberof digitaldelta
         * @interface IChatMessage
         * @property {string|null} [messageId] ChatMessage messageId
         * @property {string|null} [recipientNodeId] ChatMessage recipientNodeId
         * @property {string|null} [content] ChatMessage content
         * @property {digitaldelta.IMeshMetadata|null} [meta] ChatMessage meta
         */

        /**
         * Constructs a new ChatMessage.
         * @memberof digitaldelta
         * @classdesc Represents a ChatMessage.
         * @implements IChatMessage
         * @constructor
         * @param {digitaldelta.IChatMessage=} [properties] Properties to set
         */
        function ChatMessage(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatMessage messageId.
         * @member {string} messageId
         * @memberof digitaldelta.ChatMessage
         * @instance
         */
        ChatMessage.prototype.messageId = "";

        /**
         * ChatMessage recipientNodeId.
         * @member {string} recipientNodeId
         * @memberof digitaldelta.ChatMessage
         * @instance
         */
        ChatMessage.prototype.recipientNodeId = "";

        /**
         * ChatMessage content.
         * @member {string} content
         * @memberof digitaldelta.ChatMessage
         * @instance
         */
        ChatMessage.prototype.content = "";

        /**
         * ChatMessage meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.ChatMessage
         * @instance
         */
        ChatMessage.prototype.meta = null;

        /**
         * Creates a new ChatMessage instance using the specified properties.
         * @function create
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {digitaldelta.IChatMessage=} [properties] Properties to set
         * @returns {digitaldelta.ChatMessage} ChatMessage instance
         */
        ChatMessage.create = function create(properties) {
            return new ChatMessage(properties);
        };

        /**
         * Encodes the specified ChatMessage message. Does not implicitly {@link digitaldelta.ChatMessage.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {digitaldelta.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageId != null && Object.hasOwnProperty.call(message, "messageId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.messageId);
            if (message.recipientNodeId != null && Object.hasOwnProperty.call(message, "recipientNodeId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.recipientNodeId);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.content);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ChatMessage message, length delimited. Does not implicitly {@link digitaldelta.ChatMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {digitaldelta.IChatMessage} message ChatMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.ChatMessage();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.messageId = reader.string();
                        break;
                    }
                case 2: {
                        message.recipientNodeId = reader.string();
                        break;
                    }
                case 3: {
                        message.content = reader.string();
                        break;
                    }
                case 4: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.ChatMessage} ChatMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatMessage message.
         * @function verify
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                if (!$util.isString(message.messageId))
                    return "messageId: string expected";
            if (message.recipientNodeId != null && message.hasOwnProperty("recipientNodeId"))
                if (!$util.isString(message.recipientNodeId))
                    return "recipientNodeId: string expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates a ChatMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.ChatMessage} ChatMessage
         */
        ChatMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.ChatMessage)
                return object;
            var message = new $root.digitaldelta.ChatMessage();
            if (object.messageId != null)
                message.messageId = String(object.messageId);
            if (object.recipientNodeId != null)
                message.recipientNodeId = String(object.recipientNodeId);
            if (object.content != null)
                message.content = String(object.content);
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.ChatMessage.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {digitaldelta.ChatMessage} message ChatMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.messageId = "";
                object.recipientNodeId = "";
                object.content = "";
                object.meta = null;
            }
            if (message.messageId != null && message.hasOwnProperty("messageId"))
                object.messageId = message.messageId;
            if (message.recipientNodeId != null && message.hasOwnProperty("recipientNodeId"))
                object.recipientNodeId = message.recipientNodeId;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this ChatMessage to JSON.
         * @function toJSON
         * @memberof digitaldelta.ChatMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ChatMessage
         * @function getTypeUrl
         * @memberof digitaldelta.ChatMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ChatMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.ChatMessage";
        };

        return ChatMessage;
    })();

    digitaldelta.DeliveryTask = (function() {

        /**
         * Properties of a DeliveryTask.
         * @memberof digitaldelta
         * @interface IDeliveryTask
         * @property {string|null} [taskId] DeliveryTask taskId
         * @property {string|null} [currentHolderId] DeliveryTask currentHolderId
         * @property {digitaldelta.ITriageRequest|null} [originalRequest] DeliveryTask originalRequest
         * @property {digitaldelta.TaskStatus|null} [status] DeliveryTask status
         * @property {Uint8Array|null} [managerSignature] DeliveryTask managerSignature
         * @property {Uint8Array|null} [campCommanderSig] DeliveryTask campCommanderSig
         * @property {Uint8Array|null} [droneOperatorSig] DeliveryTask droneOperatorSig
         * @property {digitaldelta.IMeshMetadata|null} [meta] DeliveryTask meta
         */

        /**
         * Constructs a new DeliveryTask.
         * @memberof digitaldelta
         * @classdesc Represents a DeliveryTask.
         * @implements IDeliveryTask
         * @constructor
         * @param {digitaldelta.IDeliveryTask=} [properties] Properties to set
         */
        function DeliveryTask(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DeliveryTask taskId.
         * @member {string} taskId
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.taskId = "";

        /**
         * DeliveryTask currentHolderId.
         * @member {string} currentHolderId
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.currentHolderId = "";

        /**
         * DeliveryTask originalRequest.
         * @member {digitaldelta.ITriageRequest|null|undefined} originalRequest
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.originalRequest = null;

        /**
         * DeliveryTask status.
         * @member {digitaldelta.TaskStatus} status
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.status = 0;

        /**
         * DeliveryTask managerSignature.
         * @member {Uint8Array} managerSignature
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.managerSignature = $util.newBuffer([]);

        /**
         * DeliveryTask campCommanderSig.
         * @member {Uint8Array} campCommanderSig
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.campCommanderSig = $util.newBuffer([]);

        /**
         * DeliveryTask droneOperatorSig.
         * @member {Uint8Array} droneOperatorSig
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.droneOperatorSig = $util.newBuffer([]);

        /**
         * DeliveryTask meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.DeliveryTask
         * @instance
         */
        DeliveryTask.prototype.meta = null;

        /**
         * Creates a new DeliveryTask instance using the specified properties.
         * @function create
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {digitaldelta.IDeliveryTask=} [properties] Properties to set
         * @returns {digitaldelta.DeliveryTask} DeliveryTask instance
         */
        DeliveryTask.create = function create(properties) {
            return new DeliveryTask(properties);
        };

        /**
         * Encodes the specified DeliveryTask message. Does not implicitly {@link digitaldelta.DeliveryTask.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {digitaldelta.IDeliveryTask} message DeliveryTask message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeliveryTask.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.taskId != null && Object.hasOwnProperty.call(message, "taskId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.taskId);
            if (message.currentHolderId != null && Object.hasOwnProperty.call(message, "currentHolderId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.currentHolderId);
            if (message.originalRequest != null && Object.hasOwnProperty.call(message, "originalRequest"))
                $root.digitaldelta.TriageRequest.encode(message.originalRequest, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.status);
            if (message.managerSignature != null && Object.hasOwnProperty.call(message, "managerSignature"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.managerSignature);
            if (message.campCommanderSig != null && Object.hasOwnProperty.call(message, "campCommanderSig"))
                writer.uint32(/* id 6, wireType 2 =*/50).bytes(message.campCommanderSig);
            if (message.droneOperatorSig != null && Object.hasOwnProperty.call(message, "droneOperatorSig"))
                writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.droneOperatorSig);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DeliveryTask message, length delimited. Does not implicitly {@link digitaldelta.DeliveryTask.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {digitaldelta.IDeliveryTask} message DeliveryTask message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DeliveryTask.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DeliveryTask message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.DeliveryTask} DeliveryTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeliveryTask.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.DeliveryTask();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.taskId = reader.string();
                        break;
                    }
                case 2: {
                        message.currentHolderId = reader.string();
                        break;
                    }
                case 3: {
                        message.originalRequest = $root.digitaldelta.TriageRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.status = reader.int32();
                        break;
                    }
                case 5: {
                        message.managerSignature = reader.bytes();
                        break;
                    }
                case 6: {
                        message.campCommanderSig = reader.bytes();
                        break;
                    }
                case 7: {
                        message.droneOperatorSig = reader.bytes();
                        break;
                    }
                case 8: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DeliveryTask message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.DeliveryTask} DeliveryTask
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DeliveryTask.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DeliveryTask message.
         * @function verify
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DeliveryTask.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.taskId != null && message.hasOwnProperty("taskId"))
                if (!$util.isString(message.taskId))
                    return "taskId: string expected";
            if (message.currentHolderId != null && message.hasOwnProperty("currentHolderId"))
                if (!$util.isString(message.currentHolderId))
                    return "currentHolderId: string expected";
            if (message.originalRequest != null && message.hasOwnProperty("originalRequest")) {
                var error = $root.digitaldelta.TriageRequest.verify(message.originalRequest);
                if (error)
                    return "originalRequest." + error;
            }
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.managerSignature != null && message.hasOwnProperty("managerSignature"))
                if (!(message.managerSignature && typeof message.managerSignature.length === "number" || $util.isString(message.managerSignature)))
                    return "managerSignature: buffer expected";
            if (message.campCommanderSig != null && message.hasOwnProperty("campCommanderSig"))
                if (!(message.campCommanderSig && typeof message.campCommanderSig.length === "number" || $util.isString(message.campCommanderSig)))
                    return "campCommanderSig: buffer expected";
            if (message.droneOperatorSig != null && message.hasOwnProperty("droneOperatorSig"))
                if (!(message.droneOperatorSig && typeof message.droneOperatorSig.length === "number" || $util.isString(message.droneOperatorSig)))
                    return "droneOperatorSig: buffer expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates a DeliveryTask message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.DeliveryTask} DeliveryTask
         */
        DeliveryTask.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.DeliveryTask)
                return object;
            var message = new $root.digitaldelta.DeliveryTask();
            if (object.taskId != null)
                message.taskId = String(object.taskId);
            if (object.currentHolderId != null)
                message.currentHolderId = String(object.currentHolderId);
            if (object.originalRequest != null) {
                if (typeof object.originalRequest !== "object")
                    throw TypeError(".digitaldelta.DeliveryTask.originalRequest: object expected");
                message.originalRequest = $root.digitaldelta.TriageRequest.fromObject(object.originalRequest);
            }
            switch (object.status) {
            default:
                if (typeof object.status === "number") {
                    message.status = object.status;
                    break;
                }
                break;
            case "PENDING":
            case 0:
                message.status = 0;
                break;
            case "ASSIGNED":
            case 1:
                message.status = 1;
                break;
            case "IN_TRANSIT":
            case 2:
                message.status = 2;
                break;
            case "HANDOFF_IN_PROGRESS":
            case 3:
                message.status = 3;
                break;
            case "DELIVERED":
            case 4:
                message.status = 4;
                break;
            }
            if (object.managerSignature != null)
                if (typeof object.managerSignature === "string")
                    $util.base64.decode(object.managerSignature, message.managerSignature = $util.newBuffer($util.base64.length(object.managerSignature)), 0);
                else if (object.managerSignature.length >= 0)
                    message.managerSignature = object.managerSignature;
            if (object.campCommanderSig != null)
                if (typeof object.campCommanderSig === "string")
                    $util.base64.decode(object.campCommanderSig, message.campCommanderSig = $util.newBuffer($util.base64.length(object.campCommanderSig)), 0);
                else if (object.campCommanderSig.length >= 0)
                    message.campCommanderSig = object.campCommanderSig;
            if (object.droneOperatorSig != null)
                if (typeof object.droneOperatorSig === "string")
                    $util.base64.decode(object.droneOperatorSig, message.droneOperatorSig = $util.newBuffer($util.base64.length(object.droneOperatorSig)), 0);
                else if (object.droneOperatorSig.length >= 0)
                    message.droneOperatorSig = object.droneOperatorSig;
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.DeliveryTask.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from a DeliveryTask message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {digitaldelta.DeliveryTask} message DeliveryTask
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DeliveryTask.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.taskId = "";
                object.currentHolderId = "";
                object.originalRequest = null;
                object.status = options.enums === String ? "PENDING" : 0;
                if (options.bytes === String)
                    object.managerSignature = "";
                else {
                    object.managerSignature = [];
                    if (options.bytes !== Array)
                        object.managerSignature = $util.newBuffer(object.managerSignature);
                }
                if (options.bytes === String)
                    object.campCommanderSig = "";
                else {
                    object.campCommanderSig = [];
                    if (options.bytes !== Array)
                        object.campCommanderSig = $util.newBuffer(object.campCommanderSig);
                }
                if (options.bytes === String)
                    object.droneOperatorSig = "";
                else {
                    object.droneOperatorSig = [];
                    if (options.bytes !== Array)
                        object.droneOperatorSig = $util.newBuffer(object.droneOperatorSig);
                }
                object.meta = null;
            }
            if (message.taskId != null && message.hasOwnProperty("taskId"))
                object.taskId = message.taskId;
            if (message.currentHolderId != null && message.hasOwnProperty("currentHolderId"))
                object.currentHolderId = message.currentHolderId;
            if (message.originalRequest != null && message.hasOwnProperty("originalRequest"))
                object.originalRequest = $root.digitaldelta.TriageRequest.toObject(message.originalRequest, options);
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.digitaldelta.TaskStatus[message.status] === undefined ? message.status : $root.digitaldelta.TaskStatus[message.status] : message.status;
            if (message.managerSignature != null && message.hasOwnProperty("managerSignature"))
                object.managerSignature = options.bytes === String ? $util.base64.encode(message.managerSignature, 0, message.managerSignature.length) : options.bytes === Array ? Array.prototype.slice.call(message.managerSignature) : message.managerSignature;
            if (message.campCommanderSig != null && message.hasOwnProperty("campCommanderSig"))
                object.campCommanderSig = options.bytes === String ? $util.base64.encode(message.campCommanderSig, 0, message.campCommanderSig.length) : options.bytes === Array ? Array.prototype.slice.call(message.campCommanderSig) : message.campCommanderSig;
            if (message.droneOperatorSig != null && message.hasOwnProperty("droneOperatorSig"))
                object.droneOperatorSig = options.bytes === String ? $util.base64.encode(message.droneOperatorSig, 0, message.droneOperatorSig.length) : options.bytes === Array ? Array.prototype.slice.call(message.droneOperatorSig) : message.droneOperatorSig;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this DeliveryTask to JSON.
         * @function toJSON
         * @memberof digitaldelta.DeliveryTask
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DeliveryTask.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for DeliveryTask
         * @function getTypeUrl
         * @memberof digitaldelta.DeliveryTask
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        DeliveryTask.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.DeliveryTask";
        };

        return DeliveryTask;
    })();

    digitaldelta.SyncEnvelope = (function() {

        /**
         * Properties of a SyncEnvelope.
         * @memberof digitaldelta
         * @interface ISyncEnvelope
         * @property {string|null} [senderNodeId] SyncEnvelope senderNodeId
         * @property {Uint8Array|null} [senderPublicKey] SyncEnvelope senderPublicKey
         * @property {digitaldelta.ITriageRequest|null} [triageUpdate] SyncEnvelope triageUpdate
         * @property {digitaldelta.IInventoryStock|null} [inventoryUpdate] SyncEnvelope inventoryUpdate
         * @property {digitaldelta.IRoadStatus|null} [roadUpdate] SyncEnvelope roadUpdate
         * @property {digitaldelta.IDeliveryTask|null} [taskUpdate] SyncEnvelope taskUpdate
         * @property {digitaldelta.IUserIdentity|null} [registration] SyncEnvelope registration
         * @property {digitaldelta.IChatMessage|null} [chatUpdate] SyncEnvelope chatUpdate
         */

        /**
         * Constructs a new SyncEnvelope.
         * @memberof digitaldelta
         * @classdesc Represents a SyncEnvelope.
         * @implements ISyncEnvelope
         * @constructor
         * @param {digitaldelta.ISyncEnvelope=} [properties] Properties to set
         */
        function SyncEnvelope(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SyncEnvelope senderNodeId.
         * @member {string} senderNodeId
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.senderNodeId = "";

        /**
         * SyncEnvelope senderPublicKey.
         * @member {Uint8Array} senderPublicKey
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.senderPublicKey = $util.newBuffer([]);

        /**
         * SyncEnvelope triageUpdate.
         * @member {digitaldelta.ITriageRequest|null|undefined} triageUpdate
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.triageUpdate = null;

        /**
         * SyncEnvelope inventoryUpdate.
         * @member {digitaldelta.IInventoryStock|null|undefined} inventoryUpdate
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.inventoryUpdate = null;

        /**
         * SyncEnvelope roadUpdate.
         * @member {digitaldelta.IRoadStatus|null|undefined} roadUpdate
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.roadUpdate = null;

        /**
         * SyncEnvelope taskUpdate.
         * @member {digitaldelta.IDeliveryTask|null|undefined} taskUpdate
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.taskUpdate = null;

        /**
         * SyncEnvelope registration.
         * @member {digitaldelta.IUserIdentity|null|undefined} registration
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.registration = null;

        /**
         * SyncEnvelope chatUpdate.
         * @member {digitaldelta.IChatMessage|null|undefined} chatUpdate
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        SyncEnvelope.prototype.chatUpdate = null;

        // OneOf field names bound to virtual getters and setters
        var $oneOfFields;

        /**
         * SyncEnvelope payload.
         * @member {"triageUpdate"|"inventoryUpdate"|"roadUpdate"|"taskUpdate"|"registration"|"chatUpdate"|undefined} payload
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         */
        Object.defineProperty(SyncEnvelope.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["triageUpdate", "inventoryUpdate", "roadUpdate", "taskUpdate", "registration", "chatUpdate"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new SyncEnvelope instance using the specified properties.
         * @function create
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {digitaldelta.ISyncEnvelope=} [properties] Properties to set
         * @returns {digitaldelta.SyncEnvelope} SyncEnvelope instance
         */
        SyncEnvelope.create = function create(properties) {
            return new SyncEnvelope(properties);
        };

        /**
         * Encodes the specified SyncEnvelope message. Does not implicitly {@link digitaldelta.SyncEnvelope.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {digitaldelta.ISyncEnvelope} message SyncEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncEnvelope.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderNodeId != null && Object.hasOwnProperty.call(message, "senderNodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.senderNodeId);
            if (message.senderPublicKey != null && Object.hasOwnProperty.call(message, "senderPublicKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.senderPublicKey);
            if (message.triageUpdate != null && Object.hasOwnProperty.call(message, "triageUpdate"))
                $root.digitaldelta.TriageRequest.encode(message.triageUpdate, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.inventoryUpdate != null && Object.hasOwnProperty.call(message, "inventoryUpdate"))
                $root.digitaldelta.InventoryStock.encode(message.inventoryUpdate, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.roadUpdate != null && Object.hasOwnProperty.call(message, "roadUpdate"))
                $root.digitaldelta.RoadStatus.encode(message.roadUpdate, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.taskUpdate != null && Object.hasOwnProperty.call(message, "taskUpdate"))
                $root.digitaldelta.DeliveryTask.encode(message.taskUpdate, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.registration != null && Object.hasOwnProperty.call(message, "registration"))
                $root.digitaldelta.UserIdentity.encode(message.registration, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.chatUpdate != null && Object.hasOwnProperty.call(message, "chatUpdate"))
                $root.digitaldelta.ChatMessage.encode(message.chatUpdate, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified SyncEnvelope message, length delimited. Does not implicitly {@link digitaldelta.SyncEnvelope.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {digitaldelta.ISyncEnvelope} message SyncEnvelope message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SyncEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SyncEnvelope message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.SyncEnvelope} SyncEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncEnvelope.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.SyncEnvelope();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.senderNodeId = reader.string();
                        break;
                    }
                case 2: {
                        message.senderPublicKey = reader.bytes();
                        break;
                    }
                case 3: {
                        message.triageUpdate = $root.digitaldelta.TriageRequest.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.inventoryUpdate = $root.digitaldelta.InventoryStock.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.roadUpdate = $root.digitaldelta.RoadStatus.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.taskUpdate = $root.digitaldelta.DeliveryTask.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.registration = $root.digitaldelta.UserIdentity.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.chatUpdate = $root.digitaldelta.ChatMessage.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SyncEnvelope message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.SyncEnvelope} SyncEnvelope
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SyncEnvelope.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SyncEnvelope message.
         * @function verify
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SyncEnvelope.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            var properties = {};
            if (message.senderNodeId != null && message.hasOwnProperty("senderNodeId"))
                if (!$util.isString(message.senderNodeId))
                    return "senderNodeId: string expected";
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                if (!(message.senderPublicKey && typeof message.senderPublicKey.length === "number" || $util.isString(message.senderPublicKey)))
                    return "senderPublicKey: buffer expected";
            if (message.triageUpdate != null && message.hasOwnProperty("triageUpdate")) {
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.TriageRequest.verify(message.triageUpdate);
                    if (error)
                        return "triageUpdate." + error;
                }
            }
            if (message.inventoryUpdate != null && message.hasOwnProperty("inventoryUpdate")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.InventoryStock.verify(message.inventoryUpdate);
                    if (error)
                        return "inventoryUpdate." + error;
                }
            }
            if (message.roadUpdate != null && message.hasOwnProperty("roadUpdate")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.RoadStatus.verify(message.roadUpdate);
                    if (error)
                        return "roadUpdate." + error;
                }
            }
            if (message.taskUpdate != null && message.hasOwnProperty("taskUpdate")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.DeliveryTask.verify(message.taskUpdate);
                    if (error)
                        return "taskUpdate." + error;
                }
            }
            if (message.registration != null && message.hasOwnProperty("registration")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.UserIdentity.verify(message.registration);
                    if (error)
                        return "registration." + error;
                }
            }
            if (message.chatUpdate != null && message.hasOwnProperty("chatUpdate")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                {
                    var error = $root.digitaldelta.ChatMessage.verify(message.chatUpdate);
                    if (error)
                        return "chatUpdate." + error;
                }
            }
            return null;
        };

        /**
         * Creates a SyncEnvelope message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.SyncEnvelope} SyncEnvelope
         */
        SyncEnvelope.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.SyncEnvelope)
                return object;
            var message = new $root.digitaldelta.SyncEnvelope();
            if (object.senderNodeId != null)
                message.senderNodeId = String(object.senderNodeId);
            if (object.senderPublicKey != null)
                if (typeof object.senderPublicKey === "string")
                    $util.base64.decode(object.senderPublicKey, message.senderPublicKey = $util.newBuffer($util.base64.length(object.senderPublicKey)), 0);
                else if (object.senderPublicKey.length >= 0)
                    message.senderPublicKey = object.senderPublicKey;
            if (object.triageUpdate != null) {
                if (typeof object.triageUpdate !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.triageUpdate: object expected");
                message.triageUpdate = $root.digitaldelta.TriageRequest.fromObject(object.triageUpdate);
            }
            if (object.inventoryUpdate != null) {
                if (typeof object.inventoryUpdate !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.inventoryUpdate: object expected");
                message.inventoryUpdate = $root.digitaldelta.InventoryStock.fromObject(object.inventoryUpdate);
            }
            if (object.roadUpdate != null) {
                if (typeof object.roadUpdate !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.roadUpdate: object expected");
                message.roadUpdate = $root.digitaldelta.RoadStatus.fromObject(object.roadUpdate);
            }
            if (object.taskUpdate != null) {
                if (typeof object.taskUpdate !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.taskUpdate: object expected");
                message.taskUpdate = $root.digitaldelta.DeliveryTask.fromObject(object.taskUpdate);
            }
            if (object.registration != null) {
                if (typeof object.registration !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.registration: object expected");
                message.registration = $root.digitaldelta.UserIdentity.fromObject(object.registration);
            }
            if (object.chatUpdate != null) {
                if (typeof object.chatUpdate !== "object")
                    throw TypeError(".digitaldelta.SyncEnvelope.chatUpdate: object expected");
                message.chatUpdate = $root.digitaldelta.ChatMessage.fromObject(object.chatUpdate);
            }
            return message;
        };

        /**
         * Creates a plain object from a SyncEnvelope message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {digitaldelta.SyncEnvelope} message SyncEnvelope
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SyncEnvelope.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.senderNodeId = "";
                if (options.bytes === String)
                    object.senderPublicKey = "";
                else {
                    object.senderPublicKey = [];
                    if (options.bytes !== Array)
                        object.senderPublicKey = $util.newBuffer(object.senderPublicKey);
                }
            }
            if (message.senderNodeId != null && message.hasOwnProperty("senderNodeId"))
                object.senderNodeId = message.senderNodeId;
            if (message.senderPublicKey != null && message.hasOwnProperty("senderPublicKey"))
                object.senderPublicKey = options.bytes === String ? $util.base64.encode(message.senderPublicKey, 0, message.senderPublicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.senderPublicKey) : message.senderPublicKey;
            if (message.triageUpdate != null && message.hasOwnProperty("triageUpdate")) {
                object.triageUpdate = $root.digitaldelta.TriageRequest.toObject(message.triageUpdate, options);
                if (options.oneofs)
                    object.payload = "triageUpdate";
            }
            if (message.inventoryUpdate != null && message.hasOwnProperty("inventoryUpdate")) {
                object.inventoryUpdate = $root.digitaldelta.InventoryStock.toObject(message.inventoryUpdate, options);
                if (options.oneofs)
                    object.payload = "inventoryUpdate";
            }
            if (message.roadUpdate != null && message.hasOwnProperty("roadUpdate")) {
                object.roadUpdate = $root.digitaldelta.RoadStatus.toObject(message.roadUpdate, options);
                if (options.oneofs)
                    object.payload = "roadUpdate";
            }
            if (message.taskUpdate != null && message.hasOwnProperty("taskUpdate")) {
                object.taskUpdate = $root.digitaldelta.DeliveryTask.toObject(message.taskUpdate, options);
                if (options.oneofs)
                    object.payload = "taskUpdate";
            }
            if (message.registration != null && message.hasOwnProperty("registration")) {
                object.registration = $root.digitaldelta.UserIdentity.toObject(message.registration, options);
                if (options.oneofs)
                    object.payload = "registration";
            }
            if (message.chatUpdate != null && message.hasOwnProperty("chatUpdate")) {
                object.chatUpdate = $root.digitaldelta.ChatMessage.toObject(message.chatUpdate, options);
                if (options.oneofs)
                    object.payload = "chatUpdate";
            }
            return object;
        };

        /**
         * Converts this SyncEnvelope to JSON.
         * @function toJSON
         * @memberof digitaldelta.SyncEnvelope
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SyncEnvelope.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SyncEnvelope
         * @function getTypeUrl
         * @memberof digitaldelta.SyncEnvelope
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SyncEnvelope.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.SyncEnvelope";
        };

        return SyncEnvelope;
    })();

    digitaldelta.UserIdentity = (function() {

        /**
         * Properties of a UserIdentity.
         * @memberof digitaldelta
         * @interface IUserIdentity
         * @property {string|null} [nodeId] UserIdentity nodeId
         * @property {digitaldelta.Role|null} [role] UserIdentity role
         * @property {string|null} [displayName] UserIdentity displayName
         * @property {Uint8Array|null} [publicKey] UserIdentity publicKey
         * @property {digitaldelta.IMeshMetadata|null} [meta] UserIdentity meta
         */

        /**
         * Constructs a new UserIdentity.
         * @memberof digitaldelta
         * @classdesc Represents a UserIdentity.
         * @implements IUserIdentity
         * @constructor
         * @param {digitaldelta.IUserIdentity=} [properties] Properties to set
         */
        function UserIdentity(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UserIdentity nodeId.
         * @member {string} nodeId
         * @memberof digitaldelta.UserIdentity
         * @instance
         */
        UserIdentity.prototype.nodeId = "";

        /**
         * UserIdentity role.
         * @member {digitaldelta.Role} role
         * @memberof digitaldelta.UserIdentity
         * @instance
         */
        UserIdentity.prototype.role = 0;

        /**
         * UserIdentity displayName.
         * @member {string} displayName
         * @memberof digitaldelta.UserIdentity
         * @instance
         */
        UserIdentity.prototype.displayName = "";

        /**
         * UserIdentity publicKey.
         * @member {Uint8Array} publicKey
         * @memberof digitaldelta.UserIdentity
         * @instance
         */
        UserIdentity.prototype.publicKey = $util.newBuffer([]);

        /**
         * UserIdentity meta.
         * @member {digitaldelta.IMeshMetadata|null|undefined} meta
         * @memberof digitaldelta.UserIdentity
         * @instance
         */
        UserIdentity.prototype.meta = null;

        /**
         * Creates a new UserIdentity instance using the specified properties.
         * @function create
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {digitaldelta.IUserIdentity=} [properties] Properties to set
         * @returns {digitaldelta.UserIdentity} UserIdentity instance
         */
        UserIdentity.create = function create(properties) {
            return new UserIdentity(properties);
        };

        /**
         * Encodes the specified UserIdentity message. Does not implicitly {@link digitaldelta.UserIdentity.verify|verify} messages.
         * @function encode
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {digitaldelta.IUserIdentity} message UserIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserIdentity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.nodeId != null && Object.hasOwnProperty.call(message, "nodeId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.nodeId);
            if (message.role != null && Object.hasOwnProperty.call(message, "role"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.role);
            if (message.displayName != null && Object.hasOwnProperty.call(message, "displayName"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.displayName);
            if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.publicKey);
            if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
                $root.digitaldelta.MeshMetadata.encode(message.meta, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified UserIdentity message, length delimited. Does not implicitly {@link digitaldelta.UserIdentity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {digitaldelta.IUserIdentity} message UserIdentity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UserIdentity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UserIdentity message from the specified reader or buffer.
         * @function decode
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {digitaldelta.UserIdentity} UserIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserIdentity.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.digitaldelta.UserIdentity();
            while (reader.pos < end) {
                var tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.nodeId = reader.string();
                        break;
                    }
                case 2: {
                        message.role = reader.int32();
                        break;
                    }
                case 3: {
                        message.displayName = reader.string();
                        break;
                    }
                case 4: {
                        message.publicKey = reader.bytes();
                        break;
                    }
                case 5: {
                        message.meta = $root.digitaldelta.MeshMetadata.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a UserIdentity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {digitaldelta.UserIdentity} UserIdentity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UserIdentity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UserIdentity message.
         * @function verify
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UserIdentity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                if (!$util.isString(message.nodeId))
                    return "nodeId: string expected";
            if (message.role != null && message.hasOwnProperty("role"))
                switch (message.role) {
                default:
                    return "role: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                if (!$util.isString(message.displayName))
                    return "displayName: string expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
                    return "publicKey: buffer expected";
            if (message.meta != null && message.hasOwnProperty("meta")) {
                var error = $root.digitaldelta.MeshMetadata.verify(message.meta);
                if (error)
                    return "meta." + error;
            }
            return null;
        };

        /**
         * Creates a UserIdentity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {digitaldelta.UserIdentity} UserIdentity
         */
        UserIdentity.fromObject = function fromObject(object) {
            if (object instanceof $root.digitaldelta.UserIdentity)
                return object;
            var message = new $root.digitaldelta.UserIdentity();
            if (object.nodeId != null)
                message.nodeId = String(object.nodeId);
            switch (object.role) {
            default:
                if (typeof object.role === "number") {
                    message.role = object.role;
                    break;
                }
                break;
            case "ROLE_UNSPECIFIED":
            case 0:
                message.role = 0;
                break;
            case "FIELD_VOLUNTEER":
            case 1:
                message.role = 1;
                break;
            case "SUPPLY_MANAGER":
            case 2:
                message.role = 2;
                break;
            case "DRONE_OPERATOR":
            case 3:
                message.role = 3;
                break;
            case "CAMP_COMMANDER":
            case 4:
                message.role = 4;
                break;
            case "SYNC_ADMIN":
            case 5:
                message.role = 5;
                break;
            }
            if (object.displayName != null)
                message.displayName = String(object.displayName);
            if (object.publicKey != null)
                if (typeof object.publicKey === "string")
                    $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
                else if (object.publicKey.length >= 0)
                    message.publicKey = object.publicKey;
            if (object.meta != null) {
                if (typeof object.meta !== "object")
                    throw TypeError(".digitaldelta.UserIdentity.meta: object expected");
                message.meta = $root.digitaldelta.MeshMetadata.fromObject(object.meta);
            }
            return message;
        };

        /**
         * Creates a plain object from a UserIdentity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {digitaldelta.UserIdentity} message UserIdentity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UserIdentity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.nodeId = "";
                object.role = options.enums === String ? "ROLE_UNSPECIFIED" : 0;
                object.displayName = "";
                if (options.bytes === String)
                    object.publicKey = "";
                else {
                    object.publicKey = [];
                    if (options.bytes !== Array)
                        object.publicKey = $util.newBuffer(object.publicKey);
                }
                object.meta = null;
            }
            if (message.nodeId != null && message.hasOwnProperty("nodeId"))
                object.nodeId = message.nodeId;
            if (message.role != null && message.hasOwnProperty("role"))
                object.role = options.enums === String ? $root.digitaldelta.Role[message.role] === undefined ? message.role : $root.digitaldelta.Role[message.role] : message.role;
            if (message.displayName != null && message.hasOwnProperty("displayName"))
                object.displayName = message.displayName;
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = options.bytes === String ? $util.base64.encode(message.publicKey, 0, message.publicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicKey) : message.publicKey;
            if (message.meta != null && message.hasOwnProperty("meta"))
                object.meta = $root.digitaldelta.MeshMetadata.toObject(message.meta, options);
            return object;
        };

        /**
         * Converts this UserIdentity to JSON.
         * @function toJSON
         * @memberof digitaldelta.UserIdentity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UserIdentity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for UserIdentity
         * @function getTypeUrl
         * @memberof digitaldelta.UserIdentity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        UserIdentity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/digitaldelta.UserIdentity";
        };

        return UserIdentity;
    })();

    return digitaldelta;
})();

module.exports = $root;
