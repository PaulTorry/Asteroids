class SpaceObject {
    constructor(s, v, baseShape, theta = 0, ttl = 999999, type = "asteroid", density = 1) {
        this.s = s
        this.v = v
        this.baseShape = baseShape
        this.theta = theta
        this.omega = 0.00
        this.ttl = ttl
        this.cooldown = 0
        this.history = [this.s]
        this.historyCooldown = 0
        this.type = type
        this.age = 0
        this.density = density
        this.health = 5
        this.reCenter()
    }
    update(dt, gg) {
        this.ttl -= dt
        this.age += dt
        this.cooldown -= dt
        this.s = this.s.add(this.v.scale(dt))
        //this.v = this.v.scale(0.995)
        this.theta += this.omega * dt
        this.v = this.v.add(gg.scale(dt))
        this.updateHistory(dt)
    }
    updateHistory(dt) {
        if (this.historyCooldown <= 0) {
            this.history.push(this.s)
            this.historyCooldown = 10
            if (this.history.length > 30) {
                this.history = this.history.slice(1)
            }
        }
        this.historyCooldown -= dt / 0.05
    }
    checkBounds(bx, by) {
        // TODO: fix corners
        // const x = this.s.x
        // const xx = (x + bx) % bx
        // const y = this.s.y
        // const yy = (y + by) % by
        // this.s = new Vec(xx, yy)
        if (this.s.x > bx - 20) { this.v = new Vec(Math.min(0, this.v.x), this.v.y) }
        if (this.s.x < 20) { this.v = new Vec(Math.max(0, this.v.x), this.v.y) }
        if (this.s.y > by - 20) { this.v = new Vec(this.v.x, Math.min(0, this.v.y)) }
        if (this.s.y < 20) { this.v = new Vec(this.v.x, Math.max(0, this.v.y)) }
    }
    accelerate(keys) {
        if (keys["ArrowUp"]) this.v = this.v.add(this.facing.scale(0.35))
        if (keys["ArrowDown"]) this.v = this.v.add(this.facing.scale(-1).scale(0.35))
        if (keys["ArrowRight"]) this.theta += 0.02, this.omega = 0
        if (keys["ArrowLeft"]) this.theta -= 0.02, this.omega = 0
        if (keys[" "] && this.cooldown < 0) {
            this.cooldown = 2
            objects.push(new SpaceObject(this.s.add(this.facing.scale(40)), this.facing.scale(30).add(this.v), SpaceObject.makeTriangleShape(15, 5), this.theta, 100, "bullet"))
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
        //p.rotate(this.theta).add(this.s))
        const reloc = loc.subtract(this.s).rotate(-this.theta)
        this.v = this.v.add(j.scale(1 / this.mass))
        this.omega = loc.subtract(this.s).cross(j) / (this.momentOfInertia * 100)
        const closest = this.findClosestPoint(reloc)
        if (this.type === "ship") {
            console.log("the ship has been hit")
            this.health -= 1
            console.log(this.health)
        }
        if (this.type === "bullet") {
            this.ttl = 0
        }
        if (this.type === "asteroid") {
            //console.log(objects, this.baseShape, this.mass)
            if (this.mass < 500) {
                this.ttl = 0
            }
            else if (this.mass < 10000 && this.age > 10 && j.mag > 20000) {
                this.ttl = 0
                const opposite = this.findClosestPoint(reloc.scale(-1))
                const [a, b] = split(this.baseShape, ...[closest, opposite].sort())
                // console.log(...[closest, opposite].sort(), split(this.baseShape, ...[closest, opposite].sort()))
                objects.push(new SpaceObject(this.s, this.v.add(reloc.rotate(Math.PI / 2).unit), [...a, new Vec(0, 0)]))
                objects.push(new SpaceObject(this.s, this.v.add(reloc.rotate(-Math.PI / 2).unit), [...b, new Vec(0, 0)]))
            }
            else {
                this.baseShape[closest] = this.baseShape[closest].subtract(this.baseShape[closest].unit.scale(10))
            }
            //     //
            //     this.ttl = 0
            //     const opposite = this.findClosestPoint(reloc.scale(-1))
            //     const [a, b] = split(this.baseShape, ...[closest, opposite].sort())
            //    // console.log(...[closest, opposite].sort(), split(this.baseShape, ...[closest, opposite].sort()))
            //     objects.push(new SpaceObject(this.s, this.v, [...a, new Vec(0, 0)]))
        }
    }
    findClosestPoint(reloc) {
        let angles = this.baseShape.map((c, i) => [i, Math.abs(c.theta - reloc.theta)])
        //console.log(angles)
        return angles.reduce((p, c) => p[1] < c[1] ? p : c)[0]
    }
    get mass() {
        let triangles = this.localTriangles
        return triangles.reduce((p, c, i, a) => p + c.area, 0)*this.density
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
    //calculateGravity(g) {
    //return calculateGravity(g, this.s)
    // }
    //applyGravity(g, dt) {
    //this.v = this.v.add(this.calculateGravity(g).scale(dt))
    //}
    // putInOrbit(g) {
    //     const r = this.s.subtract(g.s)
    //     this.v = r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag))
    // }
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