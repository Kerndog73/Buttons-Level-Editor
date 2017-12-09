"use strict";

class Tool {
  onMouseMove(tile) {}
  dragRender(ctx) {}
  hoverRender(ctx, tile) {
    ctx.fillStyle = "rgba(127, 127, 127, 0.4)";
    ctx.fillRect(tile.x, tile.y, 1, 1);
  }
};

window.SelectTool = class extends Tool {
  constructor() {
    super();
    this.startTile = new Vec(-1, -1);
    this.currentTile = new Vec(-1, -1);
  }

  onMouseDown(tile) {
    this.startTile = tile;
  }

  onMouseMove(tile) {
    this.currentTile = tile;
  }

  onMouseUp(tile) {
    const rect = new Rect(this.startTile, tile);
    properties.setList(entities.findInRect(rect));
    this.startTile = new Vec(-1, -1);
  }

  dragRender(ctx) {
    const rect = new Rect(this.startTile, this.currentTile);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
    ctx.fillRect(rect.min.x, rect.min.y, rect.size().x, rect.size().y);
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