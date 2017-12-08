class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mul(other) {
    this.x *= other.x;
    this.y *= other.y;
  }

  static mul(a, b) {
    return new Vec(a.x * b.x, a.y * b.y);
  }
};