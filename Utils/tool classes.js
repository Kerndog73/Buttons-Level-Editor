"use strict";

class Tool {};

window.SelectTool = class extends Tool {
  constructor() {
    super();
    this.startTile = new Vec(0, 0);
  }

  onMouseDown(tile) {
    this.startTile = tile;
  }

  onMouseMove(tile) {}

  onMouseUp(tile) {
    const rect = new Rect(this.startTile, tile);
    entities.findInRect(rect);
  }
};

function makeFactoryTool(type) {
  window[type + "Tool"] = class extends Tool {
    constructor() {
      super();
      this.startTile = new Vec(0, 0);
      this.entity = -1;
    }

    onMouseDown(tile) {
      this.startTile = tile;
      this.entity = entities.create(type, new Rect(tile, tile));
    }

    onMouseMove(tile) {
      if (this.entity != -1) {
        entities.get(this.entity).setRect(new Rect(this.startTile, tile));
      }
    }

    onMouseUp(tile) {
      this.entity = -1;
    }
  }
}

for (let type of ENTITIES) {
  makeFactoryTool(type);
}