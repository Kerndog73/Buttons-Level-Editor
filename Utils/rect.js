class Rect {
  constructor(min, max) {
    this.min = new Vec(Math.min(min.x, max.x), Math.min(min.y, max.y));
    this.max = new Vec(Math.max(min.x, max.x), Math.max(min.y, max.y));
  }

  clone() {
    return new Rect(this.min.clone(), this.max.clone());
  }

  copy(other) {
    this.min.copy(other.min);
    this.max.copy(other.max);
  }

  size() {
    return new Vec(
      this.max.x - this.min.x + 1,
      this.max.y - this.min.y + 1
    );
  }

  interceptsWith(other) {
    return this.min.x     < other.max.x + 1 &&
           this.min.y     < other.max.y + 1 &&
           this.max.x + 1 > other.min.x     &&
           this.max.y + 1 > other.min.y;
  }
};