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
    mag () {
    return Math.sqrt(this.x*this.x + this.y*this.y)
    }
    scale(s) {
        return new Vec(this.x * s, this.y * s)
    }
    rotate(th) {
        return new Vec(this.x*Math.cos(th)-this.y*Math.sin(th), this.y*Math.cos(th)+this.x*Math.sin(th))
    }
    cross(a) {
        return (this.x*a.y)-(a.x*this.y)
    }
    unit() {
        return this.scale(1/this.mag())
    }
    theta() {
      return (Math.atan2(this.y, this.x)+(2*Math.PI))%(2*Math.PI)
    }
    cCoords() {
        return [this.mag(), this.theta()]
    }
    mid(a) {
      return new Vec ((this.x + a.x)/2, (this.y + a.y)/2 )
    }
    dot(a) {
        return (a.x*this.x + a.y*this.y)
    }
    static add(a, b) {
        return a.add(b)
    }
}