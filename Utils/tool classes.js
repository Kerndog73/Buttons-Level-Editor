class Tool {};

window.SelectTool = class extends Tool {
  constructor() {
    super();
    this.startTile = new Vec(0, 0);
  }

  onMouseDown(tile) {
    this.startTile = tile;
  }

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
    }

    onMouseDown(tile) {
      this.startTile = tile;
    }

    onMouseUp(tile) {
      entities.create(type, new Rect(this.startTile, tile));
    }
  }
}

for (let type of ENTITIES) {
  makeFactoryTool(type);
}