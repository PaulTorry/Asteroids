const dl = new DrawLayer(document.getElementById("simulationWindow").getContext("2d"), "white", "black", "white")
let screenSize = new Vec(800, 800)
let objects = [];
let G = 1

grid = [200, 400]
for (const n of grid) {
    for (const m of grid) {
        objects.push(new SpaceObject(new Vec(m, n), new Vec(0, 0)))
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key ){ //}=== "p") {
        console.log(e.key)
    }
})

draw()


function draw() {
    dl.reset()
    objects.forEach(o => dl.drawCircle(...o.s, 40, "white"))
}


function updatePhysics(dt) {
    objects.forEach((o, i) => {
        o.update(dt, calculateGravities(objects, o.s))
        o.checkBounds(...screenSize)
    })
    
}
function update(t) {
    updatePhysics(0.01)
        setTimeout(update, 1)
        draw()
}
setTimeout(update, 1)



