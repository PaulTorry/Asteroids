let canvas = document.getElementById("simulationWindow")
let objects = [
    new SpaceObject(new Vec(250, 250), new Vec(0, 0), Triangle.makeTriangle(50,20)),
    new SpaceObject(new Vec(450, 50), new Vec(0, 0), SpaceObject.makeAsteroidShape(10, 6)),
    new SpaceObject(new Vec(50, 20), new Vec(0, 0), SpaceObject.makeAsteroidShape(20, 5)),
    new SpaceObject(new Vec(350, 60), new Vec(0, 0), SpaceObject.makeAsteroidShape(50, 10))
]

// objects.forEach((v) => console.log(v.getCenterOfMass()))

let lastTime = 0
let keyLog = {}
document.addEventListener("keydown", (e) => { keyLog[e.key] = true })
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
let ctx = canvas.getContext("2d")
draw()

function keyListener(e) {
    objects[0].accelerate(e.key)
    draw()
}

function draw() {
    ctx.fillStyle = "black"
    ctx.clearRect(0, 0, 500, 500)
    ctx.strokeRect(0, 0, 500, 500)
    ctx.beginPath()

    function drawShape(s) {
        ctx.moveTo(s[0].x, s[0].y)
        s.forEach((p) => {
             return ctx.lineTo(p.x, p.y)
         })
        ctx.closePath()
        ctx.stroke()
    }
    objects.forEach((o) => drawShape(o.shape))
    objects.forEach((o, i) => {
        drawArrowRel(o.s, o.v.scale(20))
    }
    )
    drawArrowRel(new Vec(100, 300), objects.map((o) => o.v).reduce((p, c) => p.add(c)).scale(5))
    let vectorStart = new Vec(300, 300)
    objects.map((o) => o.v.scale(20)).forEach((v) => {
        drawArrowRel(vectorStart, v)
        vectorStart = vectorStart.add(v)
    }
    )
}

function drawLineAbs(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()
    ctx.stroke()
}

function drawLineRel(x, y, dx, dy) {
    drawLineAbs(x, y, x + dx, y + dy)
}

function drawArrowRel(a, da) {
    const end = a.add(da)
    const side1 = da.unit().rotate(Math.PI * 3 / 4).scale(10)
    const side2 = da.unit().rotate(Math.PI * 5 / 4).scale(10)
    drawLineRel(a.x, a.y, da.x, da.y)
    drawLineRel(end.x, end.y, side1.x, side1.y)
    drawLineRel(end.x, end.y, side2.x, side2.y)
}

function update(t) {
    let dt = (t - lastTime) / 50
    objects.forEach((o) => o.checkBounds(500, 500))
    objects.forEach((o) => o.update(dt))
    objects.forEach((o, i) => {
        if (o.ttl < 0) { objects.splice(i, 1) }
    }
    )
    objects.forEach((o, i) => {
        objects.forEach((oo, ii) => {
            if (o.isOneInside(oo.shape) && o != oo) {
                let collisionDirection = (o.s.subtract(oo.s)).unit()
                o.receiveImpulse(collisionDirection.scale(10))
                oo.receiveImpulse(collisionDirection.scale(10).scale(-1))
            }
        })
    })
    objects[0].accelerate(keyLog)
    draw()
    lastTime = t
    requestAnimationFrame(update)
}
requestAnimationFrame(update)



