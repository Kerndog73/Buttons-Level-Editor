class Tool {};

class SelectTool extends Tool {
  constructor() {
    super();
    this.startTile = new Vec(0, 0);
  }

  onMouseDown(tile) {
    this.startTile = tile;
  }

  onMouseUp(tile) {
    let rect = new Rect(this.startTile, tile);
    console.log(rect);
  }
};