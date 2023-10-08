class SpaceObject {
    constructor(sX, sY, vX, vY, baseShape) {
    this.s = new Vec(sX, sY)
    this.v = new Vec(vX, vY)
    this.baseShape = baseShape
    this.th = 0
    this.dTh = 0.01
}
update(dt) {
    this.s = this.s.add(this.v.scale(dt)) 
    this.th += this.dTh
    //this.vX = this.vX*0.9
    //this.vY = this.vY*0.9
    // console.log(dt);
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
const facing= new Vec(0,-1).rotate(this.th)
if(a==="ArrowUp")     this.v = this.v.add(facing)
if(a==="ArrowDown")     this.v = this.v.add(facing.scale(-1))
if(a==="ArrowRight")     this.th += 0.1
if(a==="ArrowLeft")     this.th -= 0.1
  this.dTh = 0
}
getShape(){
    // console.log(this.baseShape, this.s, this.baseShape.map((v)=> {v.add(this.s)}));
    return this.baseShape.map((v)=> {
        // console.log(v, this.s, v.add(this.s));
        return v.rotate(this.th).add(this.s)
    })
}

}