class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vec(this.x, this.y);
  }

  copy(other) {
    this.x = other.x;
    this.y = other.y;
  }

  eq(other) {
    return this.x == other.x && this.y == other.y;
  }

  mul(other) {
    this.x *= other.x;
    this.y *= other.y;
  }

  div(other) {
    this.x /= other.x;
    this.y /= other.y;
  }

  static mul(a, b) {
    return new Vec(a.x * b.x, a.y * b.y);
  }
};