class SpaceObject {
    constructor(sX, sY, vX, vY, baseShape) {
    this.s = new Vec(sX, sY)
    this.v = new Vec(vX, vY)
    this.baseShape = baseShape
}
update(dt) {
    this.s = this.s.add(this.v.scale(dt)) 
    //this.vX = this.vX*0.9
    //this.vY = this.vY*0.9
    console.log(dt);
}
checkBounds(a, b) {
    const boxSize = b.subtract(a)
    let xx = this.s.x
    let yy = this.s.y

    const xxx = ((xx - a.x + boxSize.x) % boxSize.x) + a.x
    const yyy = ((yy - a.y + boxSize.y) % boxSize.y) + a.y
    // console.log(xx, xxx);
    this.s = new Vec(xxx, yyy)
    
}
accelerate(a) {
this.v = this.v.add(a) 
}
getShape(){
    // console.log(this.baseShape, this.s, this.baseShape.map((v)=> {v.add(this.s)}));
    return this.baseShape.map((v)=> {
        console.log(v, this.s, v.add(this.s));
        return v.add(this.s)
    })
}

}