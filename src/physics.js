//let canvas = document.getElementById("simulationWindow")
const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
// let height = 800
// let width = 800 
let screenSize = new Vec(800,800)
//let screenCentre = new Vec(0,0)
let objects = [
    new SpaceObject(new Vec(500, 500), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, "ship"),
]
let gravityObjects = [
    { s: new Vec(250, 250), mass: 1400 },
    { s: new Vec(125, 375), mass: 7000 },
    { s: new Vec(200, 450), mass: 4010 }
]
let grid = [200, 400, 600]
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
        objects.forEach((o) => o.v = putInOrbit(findBarycentre(objects), o.s))
    }
    if (e.key === "d") {
        debugMode = (debugMode + 1) % 5
        console.log(debugMode)
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
draw()


function draw() {
    let centre = v => v.scale(-1).add(screenSize.scale(0.5))
    dl.reset()
    objects.forEach((o, i) => {
        let gb = Math.round(255/20*o.health)
        let col = o.health<20 ? "rgb(255," + gb + "," + gb + ")" : "white"
        //console.log(gb, col)
        dl.drawShape(o.shape, false, col, centre(objects[0].s))
        if (debugMode === 1) {
            dl.drawShape(o.history, true, "white")
            dl.drawArrowRel(o.s, o.v.scale(20))
            dl.drawArrowRel(o.s, calculateGravities(objects, o.s).scale(2500), "green")
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
            dl.fillText(ke.toFixed(1), o.s.x, o.s.y, "red")
            dl.fillText(pe.toFixed(1), o.s.x, o.s.y + 20, "blue")
            dl.fillText((ke + pe).toFixed(1), o.s.x - 100, o.s.y, "green")
        }
    })
    if (debugMode === 4) {
        let gridTwo = [50, 100, 150, 200, 250, 300, 350, 400, 450]
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
        o.checkBounds(screenSize)
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



