class Triangle {
  constructor(a, b, c = new Vec(0, 0)) {
    this.vertices = [a, b, c]
  }
  get pointPairs() {
    return arrayPairs(this.vertices)
  }
  isInside(p) {
    let lines = this.pointPairs
    let sides = lines.map(([a, b]) => {
      return b.subtract(a).cross(p.subtract(a)) > 0
    })
    let inside = sides.every((b) => b === sides[0])
    return inside
  }
  get midPoint() {
    return this.vertices.reduce(Vec.add).scale(1 / this.vertices.length)
  }
  get area() {
    const [aa, bb, cc] = this.vertices
    return Math.abs(0.5 * (aa.x * (bb.y - cc.y) + bb.x * (cc.y - aa.y) + cc.x * (aa.y - bb.y)))
  }
  get momentOfInertia() {
    const [aa, bb, cc] = this.vertices
    return (this.area * ((aa.subtract(cc).mag ^ 2) + (bb.subtract(cc).mag ^ 2))) / 4
  }
}
let t1 = new Triangle(new Vec(0, 5), new Vec(5, 0))
console.log(t1.area)