var Vec = /** @class */ (function () {
    function Vec(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec.prototype.mul = function (other) {
        this.x *= other.x;
        this.y *= other.y;
    };
    Vec.mul = function (a, b) {
        return new Vec(a.x * b.x, a.y * b.y);
    };
    return Vec;
}());
;
