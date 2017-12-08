let Orient = {};
makeConstProp(Orient, "UP", 0);
makeConstProp(Orient, "RIGHT", 1);
makeConstProp(Orient, "DOWN", 2);
makeConstProp(Orient, "LEFT", 3);

let PropType = {};
makeConstProp(PropType, "NONE", 0)
makeConstProp(PropType, "NUMBER", 1);
makeConstProp(PropType, "VEC", 2);
makeConstProp(PropType, "ORIENT", 3);
makeConstProp(PropType, "ID", 4);
makeConstProp(PropType, "STRING", 5);

function isType(propType, prop) {
  switch (propType) {
    case PropType.NONE:
      return prop === undefined;
    case PropType.NUMBER:
      return typeof(prop) === "number";
    case PropType.VEC:
      return prop instanceof Vec;
    case PropType.ORIENT:
      return typeof(prop) === "number" &&
             prop === (prop | 0) &&
             0 <= prop && prop <= 3;
    case PropType.ID:
      return typeof(prop) === "number" && prop === (prop | 0);
    case PropType.STRING:
      return typeof(prop) === "string";
  }
}

const positionImpl = {
  getRect: function(props) {
    if (props.hasOwnProperty("pos")) {
      return new Rect(props.pos, props.pos);
    } else {
      return new Rect(Vec.ZERO, Vec.ZERO);
    }
  },
  setRect: function(props, newRect) {
    // Rect constructor ensures that min <= max
    const rect = newRect.clone();
    props.pos = rect.min;
  },
  getPropType(name) {
    if (name == "pos") {
      return PropType.VEC;
    } else {
      return PropType.NONE;
    }
  },
  setProp(props, name, value) {
    if (name == "pos" && value instanceof Vec) {
      props.pos = value;
    } else {
      return false;
    }
    return true;
  }
};

const positionSizeImpl = {
  getRect: function(props) {
    let pos = new Vec(0, 0);
    if (props.hasOwnProperty("pos")) {
      pos = props.pos;
    }
    let size = new Vec(1, 1);
    if (props.hasOwnProperty("size")) {
      size = props.size;
    }
    return new Rect(pos, Vec.sub(Vec.add(pos, size), Vec.ONE));
  },
  setRect: function(props, newRect) {
    // Rect constructor ensures that min <= max
    let rect = newRect.clone();
    this.pos = rect.min;
    this.size = rect.size();
  },
  getPropType: function(name) {
    if (name == "pos" || name == "size") {
      return PropType.VEC;
    } else {
      return PropType.NONE;
    }
  },
  setProp: function(props, name, value) {
    if (name == "pos" && value instanceof Vec) {
      props.pos = value;
    } else if (name == "size" && value instanceof Vec) {
      props.size = value;
    } else {
      return false;
    }
    return true;
  }
};

const indexImpl = {
  getPropType: function(name) {
    if (name == "index") {
      return PropType.NUMBER;
    } else {
      return PropType.NUMBER;
    }
  },
  setProp: function(props, name, value) {
    if (name == "index" && typeof value == "number") {
      props.index = value;
    } else {
      return false;
    }
    return true;
  }
};

const lockImpl = {

}

class Entity {
  constructor(name, ...impls) {
    this.props = {};
    makeConstProp(this, "name", name);
    makeConstProp(this, "impls", impls);
  }

  getName() {
    return this.name;
  }
  getRect() {
    for (let impl in impls) {
      if (impl.hasOwnProperty("getRect")) {
        return impl.getRect(this.props);
      }
    }
    return new Rect(Vec.ZERO, Vec.ZERO);
  }
  setRect(newRect) {
    for (let impl in impls) {
      if (impl.hasOwnProperty("setRect")) {
        return impl.setRect(this.props, newRect);
      }
    }
  }
  getPropType(name) {
    for (let impl in impls) {
      if (impl.hasOwnProperty("getPropType")) {
        const type = impl.getPropType(name);
        if (type != PropType.NONE) {
          return type;
        }
      }
    }
    return PropType.NONE;
  }
  setProp(name, value) {
    for (let impl in impls) {
      if (impl.hasOwnProperty("setProp")) {
        if (impl.setProp(props, name, value)) {
          return true;
        }
      }
    }
    return false;
  }
};

function makePlayer() {
  return new Entity("Player", positionImpl);
}

function makeExit() {
  return new Entity("Exit", positionImpl);
}

function makePlatform() {
  return new Entity("Platform", positionSizeImpl);
}

function makeBox() {
  return new Entity("Box", positionSizeImpl);
}

function makeKey() {
  return new Entity("Key", positionImpl, indexImpl);
}

function makeLock() {
  return new Entity("Lock", positionImpl, indexImpl, idImpl);
}