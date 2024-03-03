function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateGravity(g, s) {
  const r = s.subtract(g.s)
  //return r.unit.scale(-g.mass/(Math.max(r.mag^2, 5)))
  return r.unit.scale(-g.mass / r.mag ** 2)
}
function gravitationalPotential(g, s) {
  const r = s.subtract(g.s)
  return -g.mass / r.mag
}