function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateForce(g, s) {
  const r = s.subtract(g.s)
  let attraction;
  let repulsion;
  let effectiveDistance;
  if (r.mag <= 1||r.mag>500) {
    return new Vec(0, 0)
  }
  effectiveDistance = (1/atomicRadius)*r.mag
  //attraction = r.unit.scale(- 1/effectiveDistance**2)
  //console.log(r, r.unit.scale(-g.mass*G / r.mag ** 2))
  //console.log(g.mass)
  return r.unit.scale(1/effectiveDistance**6 - 1/effectiveDistance**2)
}
function calculateForces(a, s) {
  return a.reduce((p, c) => p.add(calculateForce(c, s)), new Vec(0, 0))
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
function calculateOrbitVelocity(g, s, m = 0) {
  const r = s.subtract(g.s)
  if(r.mag <= 1) {
   return new Vec(0,0)
  }
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass**2 / (r.mag*(g.mass+m))))
  //return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag)) // adjust for G
}
function calculateOrbitVelocities(a, s, m) {
  return a.reduce((p, c) => p.add(calculateOrbitVelocity(c, s, m).power(2)), new Vec(0, 0)).power(0.5)
}
function split(a, si, fi) {
  let aa = a.concat(a)
  return [aa.slice(si, fi + 1), aa.slice(fi, a.length + si + 1)]
}
function makeGrid(interval, start, finish) {
  let s = Math.floor(start/interval)
  let f = Math.ceil(finish/interval)
  let grid = [...Array(f-s+1).keys()]
  .map((v,i,a) => v+s)
  .map((v,i,a) => v*interval)
  return grid
}
console.log(makeGrid(10, 12, 52))