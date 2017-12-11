"use strict";

let Orient = makeEnum([
  "UP",
  "RIGHT",
  "DOWN",
  "LEFT"
]);

let BoolOp = makeEnum([
  "AND",
  "OR",
  "XOR",
  "NAND",
  "NOR",
  "XNOR",
  "NOT"
]);

let PropType = makeEnum([
  "NONE",
  "FLOAT",
  "UINT",
  "VEC",
  "ORIENT",
  "STRING",
  "ARRAY",
  "BOOL",
  "BOOL_OP"
]);

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
      return isUint(prop) && prop < Orient.length;
    case PropType.STRING:
      return typeof(prop) === "string";
    case PropType.ARRAY:
      return prop instanceof Array && prop.every(isUint);
    case PropType.BOOL:
      return typeof(prop) === "boolean";
    case PropType.BOOL_OP:
      return isUint(prop) && prop < BoolOp.length;

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
  ["operator", [PropType.BOOL_OP, BoolOp.AND]]
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