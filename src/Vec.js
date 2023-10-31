class Vec{
    constructor(x,y) {
    this.x = x
    this.y = y
    }
    add(a) {
    return new Vec(this.x + a.x, this.y + a.y)
    }
    subtract(s) {
    return new Vec(this.x - s.x, this.y - s.y)
    }
    mag (m) {
    return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    scale(s) {
        return new Vec(this.x * s, this.y * s)
    }
    rotate(th) {
        return new Vec(this.x*Math.cos(th)-this.y*Math.sin(th), this.y*Math.cos(th)+this.x*Math.sin(th))
    }
    cross(a) {
        return this.x*a.y - a.x*this.y
    }
}
