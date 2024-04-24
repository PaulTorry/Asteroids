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

function putInOrbits(a, s){
  return a.reduce((p, c) => p.add(putInOrbit(c, s)), new Vec(0, 0))
}

function putInOrbit(g, s) {
  const r = s.subtract(g.s)
  if (r.mag <= 1) {
    return new Vec(0, 0)
  }
  // console.log(g, g.v, s, r, r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag)));
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag)) // adjust for G
}
function split(a, si, fi) {
  let aa = a.concat(a)
  return [aa.slice(si, fi + 1), aa.slice(fi, a.length + si + 1)]
}
function generateGridNumbers(interval, start, finish){
  let s = Math.floor(start/interval)
  let f = Math.ceil(finish/interval)
  let grid = [...Array(1+f-s).keys()].map(x => x+s).map(x => x*interval)
  // console.log(s,f,grid);
  return grid
}

generateGridNumbers(10, 30, 111)
generateGridNumbers(3, 30, 90)
generateGridNumbers(5, 32, 89)