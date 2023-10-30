class SpaceObject {
    constructor(s, v, baseShape, theta = 0, ttl = 99999) {
        this.s = s
        this.v = v
        this.baseShape = baseShape
        this.theta = theta
        this.omega = 0.05
        this.ttl = ttl
        this.cooldown = 0
    }
    update(dt) {
        this.ttl -= dt
        this.cooldown -= dt
        //console.log(this.ttl)
        this.s = this.s.add(this.v.scale(dt))
        //this.v = this.v.scale(0.99)
        //this.theta+=this.omega*dt
    }

    checkBounds(bx, by) {
        const x = this.s.x
        const xx = (x + bx) % bx
        const y = this.s.y
        const yy = (y + by) % by
        this.s = new Vec(xx, yy)
    }
    accelerate(keys) {
        //this.v = this.v.add(a) 
        if (keys["ArrowUp"]) this.v = this.v.add(this.facing().scale(0.35))
        if (keys["ArrowDown"]) this.v = this.v.add(this.facing().scale(-1).scale(0.35))
        if (keys["ArrowRight"]) this.theta += this.omega
        if (keys["ArrowLeft"]) this.theta -= this.omega
        if (keys[" "]&&this.cooldown<0) {
            this.cooldown = 30
            objects.push(new SpaceObject(this.facing().scale(50).add(this.s), this.facing().scale(5).add(this.v), bulletShape, this.theta, 150))
            this.v = this.v.add(this.facing().scale(-0.5))
        }
    }
    getShape() {
        return this.baseShape.map((p) => p.rotate(this.theta).add(this.s))
    }
    facing() {
        return new Vec(0, -1).rotate(this.theta)
    }
    isInside(p)  {
    let r = this.baseShape[0].mag()
    let p2 = p.subtract(this.s).mag()
    // console.log(r, p2)
    return p2<r
    }
}