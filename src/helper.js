function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateGravity(g, s) {
  const r = s.subtract(g.s)
  return r.unit.scale(-g.mass / r.mag ** 2)
}
function gravitationalPotential(g, s) {
  const r = s.subtract(g.s)
  return -g.mass / r.mag
}
function putInOrbit(g, s) {
  const r = s.subtract(g.s)
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag))
}
function split(a, si, fi) {
  let aa = a.concat(a)
  return [aa.slice(si, fi + 1), aa.slice(fi, a.length + si + 1)]
}