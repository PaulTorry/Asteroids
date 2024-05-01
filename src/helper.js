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
function calculateOrbitVelocity(g, s, m) {
  const r = s.subtract(g.s)
  if(r.mag <= 1) {
   return new Vec(0,0)
  }
  // console.log(g, s, m);
  if (m < 1) return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag))
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass ** 2 / (r.mag * (g.mass + m)))) // adjust for G
}
function calculateOrbitVelocities(a, s, m = 0) {
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