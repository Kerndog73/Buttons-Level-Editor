class Entities {
  constructor() {
    this._entities = [];
  }

  render(ctx) {
    for (let e of this._entities) {
      e.render(ctx);
    }
  }

  findAtPos(pos) {
    return findInRect(new Rect(pos, pos));
  }

  findInRect(rect) {
    let list = [];
    for (let e in this._entities) {
      if (e.getRect().interceptsWith(rect)) {
        list.push(e);
      }
    }
    return list;
  }

  create(type, rect) {
    let entity = makeEntity(type);
    entity.setRect(rect);
    this._entities.push(entity);
  }
};