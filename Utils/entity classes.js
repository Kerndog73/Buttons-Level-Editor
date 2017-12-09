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

function makePosSizeRect(name, posName) {
  window[name] = class {
    getRect(props) {
      let pos = new Vec(0, 0);
      if (props.hasOwnProperty(posName)) {
        pos = props[posName];
      }
      let size = new Vec(1, 1);
      if (props.hasOwnProperty("size")) {
        size = props.size;
      }
      return new Rect(pos, Vec.sub(Vec.add(pos, size), Vec.ONE));
    }

    setRect(props, newRect) {
      const rect = newRect.clone();
      props[posName] = rect.min;
      props.size = rect.size();
    }
  };
  makeConstProp(window[name], "VAL", new window[name]());
}

makePosSizeRect("PosSizeRect", "pos");
makePosSizeRect("MovingPlatformRect", "start");

function renderPlayer(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.ellipse(0.5, 0.5, 0.5, 0.5, 0, 0, 2 * Math.PI, false);
  ctx.fill();
}

function renderExit(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(0, 0, 255)";
  ctx.fillRect(0, 0, 1, 1);

  ctx.beginPath();
  ctx.fillStyle = "rgb(127, 127, 255)";
  ctx.fillRect(0.25, 0.25, 0.5, 0.5);
}

function renderPlatform(ctx) {
  ctx.beginPath();
  ctx.fillStyle = "rgb(63, 63, 63)";
  ctx.fillRect(0, 0, 1, 1);
}

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
  constructor(name, renderer, rect, ...defs) {
    this.props = {};
    makeConstProp(this, "name", name);
    makeConstProp(this, "renderer", renderer);
    makeConstProp(this, "rect", rect);
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
  render(ctx) {
    const mat = ctx.currentTransform;
    const rect = this.getRect();
    const size = rect.size();
    ctx.translate(rect.min.x, rect.min.y);
    ctx.scale(size.x, size.y);
    this.renderer(ctx);
    ctx.setTransform(mat.a, mat.b, mat.c, mat.d, mat.e, mat.f);
  }
};

const FACTORIES = {
  Player: function() {
    return new Entity("Player", renderPlayer, PosRect.VAL, posDef);
  },
  Exit: function() {
    return new Entity("Exit", renderExit, PosRect.VAL, posDef);
  },
  Platform: function() {
    return new Entity("Platform", renderPlatform, PosSizeRect.VAL, posSizeDef);
  },
  Box: function() {
    return new Entity("Box", null, PosSizeRect.VAL, posSizeDef);
  },
  Key: function() {
    return new Entity("Key", null, PosRect.VAL, posDef, indexDef);
  },
  Lock: function() {
    return new Entity("Lock", null, PosRect.VAL, posDef, indexDef, idDef);
  },
  Button: function() {
    return new Entity("Button", null, PosRect.VAL, posDef, orientDef, idDef);
  },
  Switch: function() {
    return new Entity("Switch", null, PosRect.VAL, posDef, orientDef, idDef);
  },
  Door: function() {
    return new Entity("Door", null, PosRect.VAL, doorDef, posDef, orientDef, inputDef);
  },
  MovingPlatform: function() {
    return new Entity("MovingPlatform", null, MovingPlatformRect.VAL, movingPlatformDef, rangeDef, inputDef);
  },
  LaserEmitter: function() {
    return new Entity("LaserEmitter", null, PosRect.VAL, posDef, rangeDef, idDef, inputDef);
  },
  LaserDetector: function() {
    return new Entity("LaserDetector", null, PosRect.VAL, detectorDef, posDef, idDef);
  },
  Text: function() {
    return new Entity("Text", null, PosRect.VAL, textDef, posDef);
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