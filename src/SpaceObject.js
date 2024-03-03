class SpaceObject {
    constructor(s, v, baseShape, theta = 0, ttl = 999999) {
        this.s = s
        this.v = v
        this.baseShape = baseShape
        this.theta = theta
        this.omega = 0.00
        this.ttl = ttl
        this.cooldown = 0
        this.history = [this.s]
        this.historyCooldown = 0
        this.reCenter()
    }
    update(dt, gg) {
        this.ttl -= dt
        this.cooldown -= dt
        this.s = this.s.add(this.v.scale(dt))
        //this.v = this.v.scale(0.995)
        this.theta += this.omega * dt
        this.v = this.v.add(gg.scale(dt))
        this.updateHistory()
    }
    updateHistory() {
        if (this.historyCooldown <= 0) {
            this.history.push(this.s)
            this.historyCooldown = 10
            if (this.history.length > 30) {
                this.history = this.history.slice(1)
            }
        }
        this.historyCooldown--
    }
    checkBounds(bx, by) {
        // TODO: fix corners
        // const x = this.s.x
        // const xx = (x + bx) % bx
        // const y = this.s.y
        // const yy = (y + by) % by
        // this.s = new Vec(xx, yy)
        if (this.s.x > bx) { this.v = new Vec(Math.min(0, this.v.x), this.v.y) }
        if (this.s.x < 0) { this.v = new Vec(Math.max(0, this.v.x), this.v.y) }
        if (this.s.y > by) { this.v = new Vec(this.v.x, Math.min(0, this.v.y)) }
        if (this.s.y < 0) { this.v = new Vec(this.v.x, Math.max(0, this.v.y)) }
    }
    accelerate(keys) {
        if (keys["ArrowUp"]) this.v = this.v.add(this.facing.scale(0.35))
        if (keys["ArrowDown"]) this.v = this.v.add(this.facing.scale(-1).scale(0.35))
        if (keys["ArrowRight"]) this.theta += 0.05, this.omega = 0
        if (keys["ArrowLeft"]) this.theta -= 0.05, this.omega = 0
        if (keys[" "] && this.cooldown < 0) {
            this.cooldown = 30
            objects.push(new SpaceObject(this.s.add(this.facing.scale(80)), this.facing.scale(5).add(this.v), SpaceObject.makeTriangleShape(20, 7), this.theta, 200))
            this.v = this.v.add(this.facing.scale(-0.5))
        }
    }
    get shape() {
        return this.baseShape.map((p) => p.rotate(this.theta).add(this.s))
    }
    get facing() {
        return new Vec(0, -1).rotate(this.theta)
    }
    isOneInside(a) {
        return !a.every(p => !this.isInside(p))
    }
    isInside(p) {
        let triangles = this.triangles
        return !triangles.every(t => !t.isInside(p))

    }
    whichOneIsInside(a) {
        return a.filter(p => this.isInside(p))[0]
    }
    get pointPairs() {
        return arrayPairs(this.shape)
    }
    get triangles() {
        return this.pointPairs.map((v, i, a) => new Triangle(v[0], v[1], this.s))
    }
    get localTriangles() {
        return arrayPairs(this.baseShape).map((v, i, a) => new Triangle(v[0], v[1]))
    }
    receiveImpulse(j, loc = this.s) {
        this.v = this.v.add(j.scale(1 / this.mass))
        this.omega = loc.subtract(this.s).cross(j) / (this.momentOfInertia * 100)
    }
    get mass() {
        let triangles = this.localTriangles
        return triangles.reduce((p, c, i, a) => p + c.area, 0)
    }
    get centerOfMass() {
        let triangles = this.localTriangles
        let weightedVec = triangles.reduce((p, c, i, a) => p.add(c.midPoint.scale(c.area)), new Vec(0, 0))
        return weightedVec.scale(1 / this.mass)
    }
    reCenter() {
        const com = this.centerOfMass
        this.s = this.s.add(com)
        this.baseShape = this.baseShape.map((c) => c.subtract(com))
    }
    get momentOfInertia() {
        let triangles = this.localTriangles
        return triangles.reduce((p, c, i, a) => c.momentOfInertia + p, 0)
    }
    get kineticEnergy() {
        return 1 / 2 * this.mass * ((this.v).mag ** 2)
    }
    calculateGravity(g) {
        return calculateGravity(g, this.s)
    }
    //applyGravity(g, dt) {
        //this.v = this.v.add(this.calculateGravity(g).scale(dt))
    //}
    putInOrbit(g) {
        const r = this.s.subtract(g.s)
        this.v = r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag))
    }
    static makeAsteroidShape(size, points) {
        let angle = 0
        let p1 = new Vec(0, -size)
        let coords = [p1]
        for (let i = 1; i < points; i++) {
            angle = ((Math.PI * 2) / points) * i
            coords.push(p1.rotate(angle).scale(Math.random() * 0.8 + 0.2))
        }
        return coords
    }
    static makeTriangleShape(length, width) {
        return [new Vec(0, -length), new Vec(-width / 2, 0), new Vec(width / 2, 0)]
    }
}