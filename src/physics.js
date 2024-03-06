const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "black")
let objects = [
    new SpaceObject(new Vec(250, 250), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, 1),
]
let gravityObjects = [
    { s: new Vec(250, 250), mass: 300 },
   { s: new Vec(100, 100), mass: 300 }
]
let grid = [100, 200, 300]
for (const n of grid) {
    for (const m of grid) {
        objects.push(new SpaceObject(new Vec(m, n), new Vec(-1, 1), SpaceObject.makeAsteroidShape(15, 10)))
    }
}
let lastTime = 0


let keyLog = {}
document.addEventListener("keydown", (e) => {
    keyLog[e.key] = true
    if (e.key === "p") {
        console.log(objects[0].momentOfInertia)
    }
    if (e.key === "o") {
        objects.forEach((o) => o.v = putInOrbit(gravityObjects[0],o.s))
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })


draw()

function draw() {
    dl.reset()

    objects.forEach((o) => dl.drawShape(o.shape))

    objects.forEach((o, i) => {
        dl.drawArrowRel(o.s, o.v.scale(20))
        const ke = Math.round(o.kineticEnergy)
        // const pe = gravitationalPotential(objects, o.s) * o.mass
        dl.fillText(ke.toFixed(1), o.s.x, o.s.y)
        // dl.fillText(pe.toFixed(1), o.s.x, o.s.y + 20)
        // dl.fillText((ke + pe).toFixed(1), o.s.x - 100, o.s.y)
        dl.drawArrowRel(o.s, calculateGravity(objects, o.s).scale(250), "red")
        dl.drawShape(o.history, true, "lightgrey")
    })

    let gridTwo = [50, 100, 150, 200, 250, 300, 350, 400, 450]
    for (const n of gridTwo) {
        for (const m of gridTwo) {
            //ctx.fillText(gravitationalPotential(gravityObjects[0], new Vec(n, m)).toFixed(1), n, m)
            //drawLineRel(n, m, ...calculateGravity(gravityObjects[0], new Vec(n, m)).scale(1000))
        }
    }

    dl.drawArrowRel(new Vec(300, 300), objects.map((o) => o.v.scale(o.mass)).reduce(Vec.add).scale(1 / 100))

    let vectorStart = new Vec(300, 300)
    objects.map((o) => o.v.scale(o.mass / 100)).forEach((v) => {
        dl.drawArrowRel(vectorStart, v)
        vectorStart = vectorStart.add(v)
    })
}

function doCollisions(o, oo, p) {
    let collisionDirection = (o.s.subtract(oo.s)).unit
    let mo = o.v.scale(o.mass)
    let moo = oo.v.scale(oo.mass)
    let frameOfReference = (mo.add(moo).scale(1 / (o.mass + oo.mass)))
    let impulse = frameOfReference.subtract(o.v).scale(o.mass * 2)
    if (impulse.dot(collisionDirection) > 0) {
        o.receiveImpulse(impulse, p)
        oo.receiveImpulse(impulse.scale(-1), p)
    }
}
function update(t) {
    let dt = 0.2 //(t - lastTime) / 50
    objects.forEach((o, i) => {
        //  let grav = objects.reduce((p, c) => c==o?p.add(calculateGravity(c, o.s)):p, new Vec(0,0)) 
        //  console.log(grav);
        o.update(dt, calculateGravity(objects, o.s))
        o.checkBounds(500, 500)
        //o.applyGravity(gravityObjects[0], dt)
        if (o.ttl < 0) { objects.splice(i, 1) }
    }
    )
    objects.forEach((o, i) => {
        objects.forEach((oo, ii) => {
            if (o.isOneInside(oo.shape) && o != oo) {
                doCollisions(o, oo, o.whichOneIsInside(oo.shape))
            }
        })
    })
    objects[0].accelerate(keyLog, dt)
    draw()
    lastTime = t
    requestAnimationFrame(update)
}
requestAnimationFrame(update)



