class Particle {
    constructor(s, v) {
        this.s = s
        this.v = v
        this.history = [this.s]
        this.historyCooldown = 0
        this.mass = 1
    }
    update(dt, gg) {
        this.s = this.s.add(this.v.scale(dt))
        this.v = this.v.scale(heatingValue)
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
    get kineticEnergy() {
        return 1 / 2 * this.mass * ((this.v).mag ** 2)
    }
}
