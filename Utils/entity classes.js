"use strict";

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
    this.renderer(ctx, this.props);
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
    return new Entity("Box", renderBox, PosSizeRect.VAL, posSizeDef);
  },
  Key: function() {
    return new Entity("Key", renderKey, PosRect.VAL, posDef, indexDef);
  },
  Lock: function() {
    return new Entity("Lock", renderLock, PosRect.VAL, posDef, indexDef, idDef);
  },
  Button: function() {
    return new Entity("Button", renderButton, PosRect.VAL, posDef, orientDef, idDef);
  },
  Switch: function() {
    return new Entity("Switch", renderSwitch, PosRect.VAL, posDef, orientDef, idDef);
  },
  Door: function() {
    return new Entity("Door", renderDoor, PosRect.VAL, doorDef, posDef, orientDef, inputDef);
  },
  MovingPlatform: function() {
    return new Entity("MovingPlatform", renderMovingPlatform, MovingPlatformRect.VAL, movingPlatformDef, rangeDef, inputDef);
  },
  LaserEmitter: function() {
    return new Entity("LaserEmitter", renderLaserEmitter, MovingPlatformRect.VAL, posDef, rangeDef, idDef, inputDef);
  },
  LaserDetector: function() {
    return new Entity("LaserDetector", renderLaserDetector, PosRect.VAL, detectorDef, posDef, idDef);
  },
  Text: function() {
    return new Entity("Text", renderText, PosRect.VAL, textDef, posDef);
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