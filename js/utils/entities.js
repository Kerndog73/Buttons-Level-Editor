"use strict";

class Entities {
  constructor() {
    this.entities = [];
  }

  render(ctx) {
    for (let e of this.entities) {
      e.render(ctx);
    }
  }

  findInRect(rect) {
    let list = [];
    for (let e of this.entities) {
      if (e.getRect().interceptsWith(rect)) {
        list.push(e);
      }
    }
    return list;
  }

  create(type, rect) {
    let entity = makeEntity(type);
    entity.setRect(rect);
    return this.entities.push(entity) - 1;
  }

  get(id) {
    if (0 <= id && id < this.entities.length) {
      return this.entities[id];
    } else {
      console.error("Index", id, "out of range");
    }
  }
};