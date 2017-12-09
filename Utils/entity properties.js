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
      return prop === undefined;
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
  ["pos", PropType.VEC]
]);

const posSizeDef = new Map([
  ["pos", PropType.VEC],
  ["size", PropType.VEC]
]);

const indexDef = new Map([
  ["index", PropType.UINT]
]);

const idDef = new Map([
  ["id", PropType.UINT]
]);

const orientDef = new Map([
  ["orient", PropType.ORIENT]
]);

const inputDef = new Map([
  ["active", PropType.BOOL],
  ["in", PropType.ARRAY],
  ["on", PropType.BOOL],
  ["operator", PropType.STRING]
]);

const doorDef = new Map([
  ["height", PropType.UINT]
]);

const rangeDef = new Map([
  ["start", PropType.VEC],
  ["end", PropType.VEC]
]);

const movingPlatformDef = new Map([
  ["size", PropType.VEC],
  ["speed", PropType.FLOAT],
  ["waiting time", PropType.FLOAT]
]);

const detectorDef = new Map([
  ["emitter", PropType.UINT]
]);

const textDef = new Map([
  ["font size", PropType.UINT],
  ["text", PropType.STRING]
]);