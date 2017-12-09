"use strict";

class EntityRect {
  getRect(props) {
    console.error("EntityRect::getRect not implemented for ", this);
  }
  setRect(props, newRect) {
    console.error("EntityRect::setRect not implemented for ", this);
  }
};

function makePosRect(name, posName) {
  window[name] = class extends EntityRect {
    getRect(props) {
      if (props.hasOwnProperty(posName)) {
        return new Rect(props[posName], props[posName]);
      } else {
        return new Rect(Vec.ZERO, Vec.ZERO);
      }
    }

    setRect(props, newRect) {
      // Rect constructor ensures that min <= max
      const rect = newRect.clone();
      props[posName] = rect.min;
    }
  };
  makeConstProp(window[name], "VAL", new window[name]());
}

function makePosSizeRect(name, posName) {
  window[name] = class extends EntityRect {
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
      // Rect constructor ensures that min <= max
      const rect = newRect.clone();
      props[posName] = rect.min;
      props.size = rect.size();
    }
  };
  makeConstProp(window[name], "VAL", new window[name]());
}

makePosRect("PosRect", "pos");
makePosRect("LaserEmitterRect", "start");

makePosSizeRect("PosSizeRect", "pos");
makePosSizeRect("MovingPlatformRect", "start");
