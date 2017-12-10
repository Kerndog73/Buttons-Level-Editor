"use strict";

let Orient = {};
makeConstProp(Orient, "UP", 0);
makeConstProp(Orient, "RIGHT", 1);
makeConstProp(Orient, "DOWN", 2);
makeConstProp(Orient, "LEFT", 3);

let PropType = {};
makeConstProp(PropType, "NONE", 0);
makeConstProp(PropType, "FLOAT", 1);
makeConstProp(PropType, "UINT", 2);
makeConstProp(PropType, "VEC", 3);
makeConstProp(PropType, "ORIENT", 4);
makeConstProp(PropType, "STRING", 5);
makeConstProp(PropType, "ARRAY", 6);
makeConstProp(PropType, "BOOL", 7);

function isUint(value) {
  return typeof(value) === "number" && value === (value | 0) && value >= 0;
}

function isType(propType, prop) {
  switch (propType) {
    case PropType.NONE:
      return prop === null;
    case PropType.FLOAT:
      return typeof(prop) === "number";
    case PropType.UINT:
      return isUint(prop);
    case PropType.VEC:
      return prop instanceof Vec && isUint(prop.x) && isUint(prop.y);
    case PropType.ORIENT:
      return isUint(prop) && 0 <= prop && prop <= 3;
    case PropType.STRING:
      return typeof(prop) === "string";
    case PropType.ARRAY:
      return prop instanceof Array && prop.every(isUint);
    case PropType.BOOLEAN:
      return typeof(prop) === "boolean";
    default:
      console.error("Invalid property type", propType);
      return false;
  }
};

const posDef = new Map([
  ["pos", [PropType.VEC, new Vec(0, 0)]]
]);

const posSizeDef = new Map([
  ["pos", [PropType.VEC, new Vec(0, 0)]],
  ["size", [PropType.VEC, new Vec(1, 1)]]
]);

const indexDef = new Map([
  ["index", [PropType.UINT, 0]]
]);

const idDef = new Map([
  ["id", [PropType.UINT, 0]]
]);

const orientDef = new Map([
  ["orient", [PropType.ORIENT, Orient.UP]]
]);

const inputDef = new Map([
  ["active", [PropType.BOOL, false]],
  ["in", [PropType.ARRAY, []]],
  ["on", [PropType.BOOL, false]],
  ["operator", [PropType.STRING, "and"]]
]);

const doorDef = new Map([
  ["height", [PropType.UINT, 1]]
]);

const rangeDef = new Map([
  ["start", [PropType.VEC, new Vec(0, 0)]],
  ["end", [PropType.VEC, new Vec(0, 0)]]
]);

const movingPlatformDef = new Map([
  ["size", [PropType.VEC, new Vec(1, 1)]],
  ["speed", [PropType.FLOAT, 1.0]],
  ["waiting time", [PropType.FLOAT, 0.0]]
]);

const detectorDef = new Map([
  ["emitter", [PropType.UINT, 0]]
]);

const textDef = new Map([
  ["font size", [PropType.UINT, 32]],
  ["text", [PropType.STRING, ""]]
]);