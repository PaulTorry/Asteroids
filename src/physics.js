const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 0.1
let objects = [
    new SpaceObject(new Vec(400, 400), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, "ship", 100),
    // new SpaceObject(new Vec(250, 250), new Vec(0, 0), SpaceObject.makeAsteroidShape(10,20), 0, 99999, "blackHole", 20),
]

let grid = [100, 200, 300]
for (const n of grid) {
    for (const m of grid) {
        objects.push(new SpaceObject(new Vec(m, n), new Vec(-1, 1), SpaceObject.makeAsteroidShape(52, 10), 0, 99999))
    }
}
let debugMode = 0
let lastTime = 0
let keyLog = {}
document.addEventListener("keydown", (e) => {
    keyLog[e.key] = true
    if (e.key === "p") { console.log(objects[0].momentOfInertia) }
    if (e.key === "o") { objects.forEach((o) => o.v = putInOrbit(findBarycentre(objects), o.s)) }
    if (e.key === "d") {
        debugMode = (debugMode + 1) % 5
        console.log(debugMode);
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
draw()


function draw() {
    dl.reset()
    // objects.forEach((o) => dl.drawShape(o.shape))
    objects.forEach((o, i) => {
        dl.drawShape(o.shape)

        if (debugMode === 1) {
            dl.drawArrowRel(o.s, o.v.scale(20))
            const ke = Math.round(o.kineticEnergy)
            const pe = gravitationalPotentials(objects, o.s) * o.mass
            dl.fillText(ke.toFixed(1), o.s.x, o.s.y, "red")
            dl.fillText(pe.toFixed(1), o.s.x, o.s.y + 20, "blue")
            dl.fillText((ke + pe).toFixed(1), o.s.x - 100, o.s.y, "green")
            dl.drawArrowRel(o.s, calculateGravities(objects, o.s).scale(2500), "green")
        }
        if (debugMode === 2) {
            dl.drawArrowRel(new Vec(100, 100), o.v.scale(5))
            dl.drawArrowRel(o.s, calculateGravities(objects, o.s).scale(2500), "green")
            dl.drawShape(o.history, true, "white")
            dl.drawArrowRel(new Vec(50 * i, 200), o.v.scale(5))
        }
    })

    if (debugMode === 3) {
        let gridTwo = [50, 100, 150, 200, 250, 300, 350, 400, 450]
        for (const n of gridTwo) {
            for (const m of gridTwo) {
                console.log(gravitationalPotentials(objects, new Vec(n, m)))
                dl.fillText(gravitationalPotentials(objects, new Vec(n, m)).toFixed(1), n, m, 'red')
                // dl.fillText("efwefwf", n, m, 'red')
                dl.drawLineRel(n, m, ...calculateGravities(objects, new Vec(n, m)).scale(1000))
            }
        }
    }
    if (debugMode === 4) {
        dl.drawArrowRel(new Vec(300, 300), objects.map((o) => o.v.scale(o.mass)).reduce(Vec.add).scale(1 / 100), "red")
        let vectorStart = new Vec(300, 300)
        objects.map((o) => o.v.scale(o.mass / 100)).forEach((v) => {
            dl.drawArrowRel(vectorStart, v, "gray")
            vectorStart = vectorStart.add(v)
        })
    }
}

// function drawLineAbs(x1, y1, x2, y2) {
//     ctx.beginPath()
//     ctx.moveTo(x1, y1)
//     ctx.lineTo(x2, y2)
//     ctx.closePath()
//     ctx.stroke()
// }

// function (x, y, dx, dy) {
//     drawLineAbs(x, y, x + dx, y + dy)
// }

// function drawArrowRel(a, da) {
//     const end = a.add(da)
//     const side1 = da.unit.rotate(Math.PI * 3 / 4).scale(10)
//     const side2 = da.unit.rotate(Math.PI * 5 / 4).scale(10)
//     dl.drawLineRel(a.x, a.y, da.x, da.y)
//     dl.drawLineRel(end.x, end.y, side1.x, side1.y)
//     dl.drawLineRel(end.x, end.y, side2.x, side2.y)
// }
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
function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateGravities(objects, o.s))   // 
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
}
function update(t) {
    let itt = 5
    let dt = 0.05 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }

    // objects.forEach((o, i) => {
    //     o.update(dt, calculateGravity(gravityObjects[0], o.s))
    //     o.checkBounds(500, 500)
    //     //o.applyGravity(gravityObjects[0], dt)
    //     if (o.ttl < 0) { objects.splice(i, 1) }
    // }
    // )
    // objects.forEach((o, i) => {
    //     objects.forEach((oo, ii) => {
    //         if (o.isOneInside(oo.shape) && o != oo) {
    //             doCollisions(o, oo, o.whichOneIsInside(oo.shape))
    //         }
    //     })
    // })
    // objects[0].accelerate(keyLog)
    objects[0].accelerate(keyLog)
    draw()
    lastTime = t
    setTimeout(update, 1)
}
setTimeout(update, 1)



