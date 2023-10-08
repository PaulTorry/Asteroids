class SpaceShip extends SpaceObject{
    constructor(sX, sY, vX, vY, baseShape, objectArray) {
    super(sX, sY, vX, vY, baseShape)
    this.objectArray
    this.cooldown = 0
}
update(dt) {
    super.update(dt)
}

accelerate(k) {
this.cooldown -= 1
const facing= new Vec(0,-1).rotate(this.th)

if(k?.ArrowUp)     this.v = this.v.add(facing)
if(k?.ArrowDown)     this.v = this.v.add(facing.scale(-1))
if(k?.ArrowRight)     this.th += 0.1
if(k?.ArrowLeft)     this.th -= 0.1
  this.dTh = 0
if(k?.[" "] && this.cooldown<1) {
        objects.push(this.makeBullet(facing))
        this.cooldown = 10
         this.v = this.v.add(facing.scale(-3))
    }
}

makeBullet(facing) {
    return new SpaceObject(
        this.s.x, this.s.y, 
        this.v.x + 5 * facing.x, this.v.y + 5 * facing.y,
        [new Vec(0.001, -2), new Vec(0, 2), new Vec(-0.001, -2)])
    }
}
