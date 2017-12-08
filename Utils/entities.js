class Entity {
  constructor(type, pos) {
    this.rect = new Rect(pos.clone(), pos.clone());
  }
};

class Entities {
  constructor() {
    this._entities = [];
  }

  foreach(callback) {
    for (let e in this._entities) {
      callback(e);
    }
  }

  findAtPos(pos) {
    return findInRect(new Rect(pos, pos));
  }

  findInRect(rect) {
    let list = [];
    for (let e in this._entities) {
      if (e.rect.interceptsWith(rect)) {
        list.push(e);
      }
    }
    return list;
  }
};