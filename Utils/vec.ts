class Vec {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  mul(other: Vec): void {
    this.x *= other.x;
    this.y *= other.y;
  }

  static mul(a: Vec, b: Vec): Vec {
    return new Vec(a.x * b.x, a.y * b.y);
  }
};