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

class EntityRect {
  getRect(props) {
    console.error("EntityRect::getRect not implemented for ", this);
  }
  setRect(props, newRect) {
    console.error("EntityRect::setRect not implemented for ", this);
  }
};

class PosRect {
  getRect(props) {
    if (props.hasOwnProperty("pos")) {
      return new Rect(props.pos, props.pos);
    } else {
      return new Rect(Vec.ZERO, Vec.ZERO);
    }
  }
  setRect(props, newRect) {
    // Rect constructor ensures that min <= max
    const rect = newRect.clone();
    props.pos = rect.min;
  }
};
makeConstProp(PosRect, "VAL", new PosRect());

class PosSizeRect {
  getRect(props) {
    let pos = new Vec(0, 0);
    if (props.hasOwnProperty("pos")) {
      pos = props.pos;
    }
    let size = new Vec(1, 1);
    if (props.hasOwnerProperty("size")) {
      size = props.size;
    }
    return new Rect(pos, Vec.sub(Vec.add(pos, size), Vec.ONE));
  }
  setRect(props, newRect) {
    const rect = newRect.clone();
    this.pos = rect.min;
    this.size = rect.size();
  }
};
makeConstProp(PosSizeRect, "VAL", new PosSizeRect());

//@FIXME this is identical to PosSizeRect except that "pos" has been renamed to "start"
class MovingPlatformRect {
  getRect(props) {
    let pos = new Vec(0, 0);
    if (props.hasOwnProperty("start")) {
      pos = props.pos;
    }
    let size = new Vec(1, 1);
    if (props.hasOwnerProperty("size")) {
      size = props.size;
    }
    return new Rect(pos, Vec.sub(Vec.add(pos, size), Vec.ONE));
  }
  setRect(props, newRect) {
    const rect = newRect.clone();
    this.start = rect.min;
    this.size = rect.size();
  }
};
makeConstProp(MovingPlatformRect, "VAL", new MovingPlatformRect());

function mergeMaps(maps) {
  let result = new Map();
  for (let map of maps) {
    map.forEach(function(value, key) {
      result.set(key, value);
    });
  }
  return result;
}

class Entity {
  constructor(name, rect, ...defs) {
    this.props = {};
    makeConstProp(this, "rect", rect);
    makeConstProp(this, "name", name);
    makeConstProp(this, "defs", mergeMaps(defs));
  }

  getName() {
    return this.name;
  }
  getRect() {
    return this.rect.getRect(this.props);
  }
  setRect(newRect) {
    this.rect.setRect(this.props, newRect);
  }
  getPropType(name) {
    const type = this.defs.get(name);
    if (type === undefined) {
      return PropType.NONE;
    } else {
      return type;
    }
  }
  setProp(name, value) {
    const type = this.defs.get(name);
    if (type !== undefined && isType(value)) {
      this.props[name] = value;
      return true;
    } else {
      return false;
    }
  }
};

const FACTORIES = {
  Player: function() {
    return new Entity("Player", PosRect.VAL, posDef);
  },
  Exit: function() {
    return new Entity("Exit", PosRect.VAL, posDef);
  },
  Platform: function() {
    return new Entity("Platform", PosSizeRect.VAL, posSizeDef);
  },
  Box: function() {
    return new Entity("Box", PosSizeRect.VAL, posSizeDef);
  },
  Key: function() {
    return new Entity("Key", PosRect.VAL, posDef, indexDef);
  },
  Lock: function() {
    return new Entity("Lock", PosRect.VAL, posDef, indexDef, idDef);
  },
  Button: function() {
    return new Entity("Button", PosRect.VAL, posDef, orientDef, idDef);
  },
  Switch: function() {
    return new Entity("Switch", PosRect.VAL, posDef, orientDef, idDef);
  },
  Door: function() {
    return new Entity("Door", PosRect.VAL, doorDef, posDef, orientDef, inputDef);
  },
  MovingPlatform: function() {
    return new Entity("MovingPlatform", MovingPlatformRect.VAL, movingPlatformDef, rangeDef, inputDef);
  },
  LaserEmitter: function() {
    return new Entity("LaserEmitter", PosRect.VAL, posDef, rangeDef, idDef, inputDef);
  },
  LaserDetector: function() {
    return new Entity("LaserDetector", PosRect.VAL, detectorDef, posDef, idDef);
  },
  Text: function() {
    return new Entity("Text", PosRect.VAL, textDef, posDef);
  }
};

const ENTITIES = Object.getOwnPropertyNames(FACTORIES);

function makeEntity(type) {
  if (FACTORIES.hasOwnProperty(type)) {
    return FACTORIES[type]();
  } else {
    console.error("Invalid entity type:", type);
    return null;
  }
}