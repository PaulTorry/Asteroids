const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
const G = 1
let screenSize = new Vec(800, 800)
let objects = []
let lastTime = 0
let atomicRadius = 50
let heatingValue = 1.00
grid = makeGrid(50, 100, 700)
for (const n of grid) {
    for (const m of grid) {
        objects.push(new Particle(new Vec(m, n), new Vec(0, 0)))
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key === "p") {
        console.log(e.key)
    }
    if(e.key === "h") {
        console.log(e.key)
        heatingValue = heatingValue + 0.001
    }
    if(e.key === "c") {
        console.log(e.key)
        heatingValue = heatingValue - 0.001
    }
})
draw()
function draw() {
    dl.reset()
    let offset = objects[0].s.scale(-1).add(screenSize.scale(0.5))
    objects.forEach((o, i) => {
        dl.drawCircle(...o.s, 20, "white")
    })
}
function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateForces(objects, o.s))
        //console.log(calculateGravities(objects, o.s), dt)
        o.checkBounds(...screenSize)
        //o.applyGravity(gravityObjects[0], dt)
    }
    )
}
function update(t) {
    let itt = 10
    let dt = 0.1 / itt //(t - lastTime) / 50 //fix
    for (let i = 0; i < itt; i++) { updatePhysics(dt) }
    lastTime = t
        setTimeout(update, 1)
        draw()
    }
setTimeout(update, 1)



