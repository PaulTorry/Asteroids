function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateGravity(g, s) {
  const r = s.subtract(g.s)
  if (r.mag <= 1) {
    return new Vec(0, 0)
  }
  //console.log(r, r.unit.scale(-g.mass*G / r.mag ** 2))
  return r.unit.scale(-g.mass * G / r.mag ** 2)
}
function calculateGravities(a, s) {
  return a.reduce((p, c) => p.add(calculateGravity(c, s)), new Vec(0, 0))
}
function gravitationalPotential(g, s) {
  const r = s.subtract(g.s)
  if (r.mag <= 1) {
    return 0
  }
  return -g.mass * G / r.mag
}
function gravitationalPotentials(a, s) {
  return a.reduce((p, c) => p + gravitationalPotential(c, s), 0)
}
function putInOrbit(g, s) {
  const r = s.subtract(g.s)
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag)) // adjust for G
}
function split(a, si, fi) {
  let aa = a.concat(a)
  return [aa.slice(si, fi + 1), aa.slice(fi, a.length + si + 1)]
}

function findBarycentre(a) {
  let direction = a.reduce((p, c) => p.add(c.s.scale(c.mass)), new Vec(0, 0))
  let totalMass = a.reduce((p, c) => p + c.mass, 0)
  console.log(direction, totalMass);
  return { s: direction.scale(1 / totalMass), mass: totalMass }
}