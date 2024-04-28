class Vec {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    *[Symbol.iterator]() {
        yield this.x
        yield this.y
    }
    add(a) {
        return new Vec(this.x + a.x, this.y + a.y)
    }
    addXY(x, y) {
        return new Vec(this.x + x, this.y + y)
    }
    subtract(s) {
        return new Vec(this.x - s.x, this.y - s.y)
    }
    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    scale(s) {
        return new Vec(this.x * s, this.y * s)
    }
    rotate(th) {
        return new Vec(this.x * Math.cos(th) - this.y * Math.sin(th), this.y * Math.cos(th) + this.x * Math.sin(th))
    }
    cross(a) {
        return (this.x * a.y) - (a.x * this.y)
    }
    power(p = 1 ){
        //return this.scale(1)
        console.log(this.unit, this.mag, this.mag**2);
        console.log(this.unit.scale(this.mag ** p));
        return this.unit.scale(this.mag)
    }
    get unit() { 
        if(this.mag < 0.00001) return new Vec(0,0)
        return this.scale(1 / this.mag)
    }
    get theta() {
        return (Math.atan2(this.y, this.x) + (2 * Math.PI)) % (2 * Math.PI)
    }
    get cCoords() {
        return [this.mag, this.theta]
    }
    mid(a) {
        return new Vec((this.x + a.x) / 2, (this.y + a.y) / 2)
    }
    dot(a) {
        return (a.x * this.x + a.y * this.y)
    }
    static add(a, b) {
        return a.add(b)
    }
}

let v = new Vec(0, 0)
console.log(v);
console.log(v.unit, v.mag, v.mag**2);
console.log(v.unit.scale(v.mag ** 0.5));
console.log(v.power(1));