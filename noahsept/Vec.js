class Vec{
    constructor(x,y) {
    this.x = x
    this.y = y
    }
    add(a) {
    return new Vec(this.x + a.x, this.y + a.y)
    }
    subtract(a) {
        return new Vec(this.x - a.x, this.y - a.y)
        }
    scale(s) {
        return new Vec(this.x * s, this.y * s)
    }
    rotate (th){
        return new Vec(this.x * Math.cos(th) - this.y * Math.sin(th), this.y * Math.cos(th) + this.x * Math.sin(th))
    }
    checkbounds (a, b){
    
        const x1 = Math.min(0, this.x-a.x)
        const x2 = Math.max(0, this.x-b.x)
        const xx = (Math.abs(x1) > x2) ? x1 : x2
    
        const y1 = Math.min(0, this.y-a.y)
        const y2 = Math.max(0, this.y-b.y)
        const yy = (Math.abs(y1) > y2) ? y1 : y2
    
        return new Vec(xx,yy)
      }


}
