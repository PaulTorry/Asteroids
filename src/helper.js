function makeArray(s,i,n){
  let c = s
  let a = []
  for(let j = n; j>0; j--){
    a.push(c)
    c += i
  }
  return a
}

function arrayPairs(arr) {
  return arr.map((v, i, a) => [a.at(i - 1), a.at(i)])
}
function calculateGravity(gg, s) {

  function calc (g){
    const r = s.subtract(g.s)
    if(r.mag < 1) return new Vec(0,0)
    return r.unit.scale(-g.mass / r.mag ** 2)
  }

  return  gg.reduce((p, c) => p.add(calc(c, s)), new Vec(0,0)) 
}



function gravitationalPotential(g, s) {
  const r = s.subtract(g.s)
  return -g.mass / r.mag
}

function putInOrbit(g, s) {
  const r = s.subtract(g.s)
  return r.rotate(Math.PI / 2).unit.scale(Math.sqrt(g.mass / r.mag))
}
