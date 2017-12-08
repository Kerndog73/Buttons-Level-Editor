class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromArray(array) {
    this.x = array[0];
    this.y = array[1];
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

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  mul(other) {
    this.x *= other.x;
    this.y *= other.y;
  }

  div(other) {
    this.x /= other.x;
    this.y /= other.y;
  }

  call(fun) {
    this.x = fun(this.x);
    this.y = fun(this.y);
  }

  static add(a, b) {
    return new Vec(a.x + b.x, a.y + b.y);
  }

  static sub(a, b) {
    return new Vec(a.x - b.x, a.y - b.y);
  }

  static mul(a, b) {
    return new Vec(a.x * b.x, a.y * b.y);
  }

  static div(a, b) {
    return new Vec(a.x / b.x, a.y / b.y);
  }
};

makeConstProp(Vec, "ZERO", new Vec(0, 0));
makeConstProp(Vec, "ONE", new Vec(1, 1));