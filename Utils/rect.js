class Rect {
  constructor(min, max) {
    this.min = new Vec(Math.min(min.x, max.x), Math.min(min.y, max.y));
    this.max = new Vec(Math.max(min.x, max.x), Math.max(min.y, max.y));
  }

  size() {
    return new Vec(
      this.max.x - this.min.x + 1,
      this.max.y - this.min.y + 1
    );
  }
};