const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(800, 800)
let objects = [
    new SpaceObject(new Vec(350, 350), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, "ship"),
]
let grid = generateGridNumbers(200, 300, screenSize.x -300)
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
    if (e.key === "p") {
        console.log(objects[0].momentOfInertia)
    }
    if (e.key === "o") {
        //objects.forEach((o) => o.v = putInOrbit(gravityObjects[0], o.s))
    }
    if (e.key === "d") {
        debugMode = (debugMode + 1) % 5
        console.log(debugMode)
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
draw()


function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    objects.forEach((o, i) => {
        let gb = Math.round(255/20*o.health)
        let col = o.health<20 ? "rgb(255," + gb + "," + gb + ")" : "white"
        //console.log(gb, col)
        dl.drawShape(o.shape, false, col, offset)
        let gridThree = generateGridNumbers(100, 0, screenSize.x -0)
        gridThree.forEach(n => dl.drawLineRel(0, n, 800, 0, "rgb(50,50,50)", offset ))
        gridThree.forEach(n => dl.drawLineRel(n, 0, 0, 800, "rgb(50,50,50)", offset ))
        dl.drawShape(o.history, true, "grey", offset)
        if (debugMode === 1) {
            // dl.drawShape(o.history, true, "grey", offset)
            dl.drawArrowRel(o.s, o.v.scale(20), "white", offset)
            dl.drawArrowRel(o.s, calculateGravities(objects, o.s).scale(2500), "green", offset)
            dl.drawShape(o.history, true, "grey", offset)
        }
        if (debugMode === 2) {
            let vectorStart = new Vec(300, 300)
            objects.map((o) => o.v.scale(o.mass / 100)).forEach((v) => {
                dl.drawArrowRel(vectorStart, v, "grey")
                vectorStart = vectorStart.add(v)
            })
            dl.drawArrowRel(new Vec(300, 300), objects.map((o) => o.v.scale(o.mass)).reduce(Vec.add).scale(1 / 100), "white")
        }
        if (debugMode === 3) {
            const ke = Math.round(o.kineticEnergy)
            const pe = gravitationalPotentials(objects, o.s) * o.mass
            dl.fillText(ke.toFixed(1), o.s.x, o.s.y, "red", offset)
            dl.fillText(pe.toFixed(1), o.s.x, o.s.y + 20, "blue", offset)
            dl.fillText((ke + pe).toFixed(1), o.s.x - 100, o.s.y, "green", offset)
        }
    })
    if (debugMode === 4) {
        let gridTwo = generateGridNumbers(100, 100, screenSize.x -100)
        for (const n of gridTwo) {
            for (const m of gridTwo) {
                dl.fillText(gravitationalPotentials(objects, new Vec(n, m)).toFixed(1), n, m, "grey")
                dl.drawLineRel(n, m, ...calculateGravities(objects, new Vec(n, m)).scale(10))
            }
        }
    }
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
function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateGravities(objects, o.s))
        o.checkBounds(...screenSize)
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
    let itt = 2
    let dt = 0.05 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }


    objects[0].accelerate(keyLog)
    draw()
    lastTime = t
    setTimeout(update, 1)
}
setTimeout(update, 1)



