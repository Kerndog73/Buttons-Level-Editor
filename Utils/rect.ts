class Rect {
  min : Vec;
  max : Vec;

  constructor(min : Vec, max : Vec) {
    this.min.x = Math.min(min.x, max.x);
    this.min.y = Math.min(min.y, max.y);
    this.max.x = Math.max(min.x, max.x);
    this.max.y = Math.max(min.y, max.y);
  }
};