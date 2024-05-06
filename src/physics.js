const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(800, 800)
let gameRunning = true
let winCondition;
let objects;
let grid;
let debugMode = 0
let lastTime = 0
let level = 1
loadLevel(level)
let keyLog = {}
document.addEventListener("keydown", (e) => {
    keyLog[e.key] = true
    if (e.key === "p") {
        console.log(objects[0].momentOfInertia)
    }
    if (e.key === "o") {
        objects.forEach((o) => o.v = calculateOrbitVelocities(objects, o.s, o.mass))
        objects.forEach((o) => console.log(o.v))
    }
    if (e.key === "d") {
        debugMode = (debugMode + 1) % 5
        console.log(debugMode)
    }
    if (e.key === "r" && gameRunning === false) {
        console.log("the game has been reset")
        loadLevel(level)
        gameRunning = true
        update()
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
draw()

function loadLevel(level = 1) {
    if (level === 1) {
        objects = [
            new SpaceObject(new Vec(500, 500), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, "ship"),
        ]

        objects.push(new SpaceObject(new Vec(200, 200), new Vec(0, 0), SpaceObject.makeAsteroidShape(52, 10), 0, 99999, "asteroid", 1))


        winCondition = () => !objects.find((v, i, a) => v.type === "asteroid")
    }
    if (level === 2) {
        objects = [
            new SpaceObject(new Vec(500, 500), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20), 0, 99999, "ship"),
        ]
        grid = [200, 400]
        for (const n of grid) {
            for (const m of grid) {
                objects.push(new SpaceObject(new Vec(m, n), new Vec(0, 0), SpaceObject.makeAsteroidShape(52, 10), 0, 99999, "asteroid", 1))
            }
        }
        winCondition = () => !objects.find((v, i, a) => v.type === "asteroid")
    }
    else {
        drawGameOverScreen("Whole game completed")
        level = 1
        draw()
    }
}
function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    objects.forEach((o, i) => {
        let gb = Math.round(255 / 5 * o.health)
        let col = o.health < 5 ? "rgb(255," + gb + "," + gb + ")" : "white"
        dl.drawShape(o.shape, false, col, offset)
        dl.drawShape(o.history, true, "grey", offset)
        makeGrid(100, 0, 800).forEach((v, i, a) => dl.drawLineAbs(0, v, 800, v, "rgb(50,50,50)", offset))
        makeGrid(100, 0, 800).forEach((v, i, a) => dl.drawLineAbs(v, 0, v, 800, "rgb(50,50,50)", offset))
        if(o.type === "ship"){
            for(let i = 1; i < o.shield; i++){
                dl.drawCircle(...objects[0].s.add(Vec.getRandomVec(3)), 40, "rgba(250,250,250, 0.4)", offset)
            }
        }
        if (debugMode === 1) {
            dl.drawShape(o.history, true, "white", offset)
            dl.drawArrowRel(o.s, o.v.scale(20), "white", offset)
            dl.drawArrowRel(o.s, calculateGravities(objects, o.s).scale(2500), "green", offset)
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
        let gridTwo = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750]
        for (const n of gridTwo) {
            for (const m of gridTwo) {
                dl.fillText(gravitationalPotentials(objects, new Vec(n, m)).toFixed(1), n, m, "grey")
                dl.drawLineRel(n, m, ...calculateGravities(objects, new Vec(n, m)).scale(10))
            }
        }
    }
}
function drawGameOverScreen(t = "defaultText") {
    dl.reset()
    dl.fillText(t, ...screenSize.scale(0.5), "white")
    dl.fillText("press R to reset", 400, 450, "white")
    console.log("hello")
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
    if (objects[0].health <= 0) {
        console.log("ship destroyed")
        drawGameOverScreen("ship destroyed")
        gameRunning = false
    }
    if (winCondition()) {
        level += 1
        console.log("you win this level")
        gameRunning = false
        drawGameOverScreen("you win this level")
    }
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }


    objects[0].accelerate(keyLog)
    lastTime = t
    if (gameRunning) {
        setTimeout(update, 1)
        draw()
    }
}
setTimeout(update, 1)



