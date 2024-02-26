let canvas = document.getElementById("simulationWindow")
let objects = [
    new SpaceObject(new Vec(250, 250), new Vec(0, 0), SpaceObject.makeTriangleShape(50, 20)),
    // new SpaceObject(new Vec(450, 50), new Vec(0, 0), SpaceObject.makeAsteroidShape(10, 6)),
    // new SpaceObject(new Vec(50, 20), new Vec(0, 0), SpaceObject.makeAsteroidShape(20, 5)),
    // new SpaceObject(new Vec(350, 60), new Vec(0, 0), SpaceObject.makeAsteroidShape(50, 10))
]
let gravityObjects = [
    {s: new Vec(250, 250), mass: 300}
]
let grid = [100]
for (const n of grid) {
    for(const m of grid) {
        objects.push(new SpaceObject(new Vec(m, n), new Vec(-1, 1), SpaceObject.makeAsteroidShape(15, 10)))
    }
}
//objects.forEach((v) => console.log(v.centerOfMass))
let lastTime = 0
let keyLog = {}
//document.addEventListener("keydown", keyListener)
document.addEventListener("keydown", (e) => { 
    keyLog[e.key] = true 
    if(e.key==="p") {
        console.log(objects[0].momentOfInertia)
    }
    if(e.key==="o") {
        objects.forEach((o) => o.putInOrbit(gravityObjects[0]))
    }
})
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })
let ctx = canvas.getContext("2d")
console.log("hello", ctx)
draw()


// //function keyListener(e) {
//     objects[0].accelerate(e.key)
//     draw()
// }

function draw() {
    //const triangleShape = [[100, 100], [150, 150], [50, 150], [100, 100]]
    ctx.fillStyle = "black"
    ctx.clearRect(0, 0, 500, 500)
    //ctx.fillRect(square.s.x - 50, square.s.y - 50, 100, 100)
    //ctx.fillStyle = "red"
    //ctx.fillRect(square.s.x - 550, square.s.y - 550, 100, 100)
    ctx.strokeRect(0, 0, 500, 500)

    ctx.beginPath()

    function drawShape(s,dontClose) {
        ctx.moveTo(s[0].x, s[0].y)
        s.forEach((p) => {
            //console.log(p.x, p)
            return ctx.lineTo(p.x, p.y)
        }
        )
        if(!dontClose) {ctx.closePath()}
        ctx.stroke()
    }
    //drawShape(triangleShape)
    objects.forEach((o) => drawShape(o.shape))
    objects.forEach((o, i) => {
        drawArrowRel(o.s, o.v.scale(20))
        ctx.font = "15px Arial";
        ctx.fillText(Math.round(o.kineticEnergy), o.s.x, o.s.y)
        //drawArrowRel(new Vec(100, 100), o.v.scale(5))
        ctx.strokeStyle = "red"
        drawArrowRel(o.s, o.calculateGravity(gravityObjects[0]).scale(2500))
        ctx.strokeStyle = "black"
        //drawShape(o.history, true)
        //drawArrowRel(new Vec(50 * i, 200), o.v.scale(5))
    }
    )
    let gridTwo = [50,100,150,200,250,300,350,400,450]
for (const n of gridTwo) {
    for(const m of gridTwo) {
       const l =  calculateGravity(gravityObjects[0], new Vec(n, m)).scale(1000)
       ctx.fillText(gravitationalPotential(gravityObjects[0], new Vec(n, m)).toFixed(1), n, m)
       drawLineRel(n, m, l.x, l.y)
       //console.log(l)
    }
}
    drawArrowRel(new Vec(300, 300), objects.map((o) => o.v.scale(o.mass)).reduce(Vec.add).scale(1/100))
    let vectorStart = new Vec(300, 300)
    ctx.strokeStyle = "grey"
    objects.map((o) => o.v.scale(o.mass/100)).forEach((v) => {
        drawArrowRel(vectorStart, v)
        vectorStart = vectorStart.add(v)
    }
   )
   ctx.strokeStyle = "black"
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
function doCollisions(o, oo, p) {
    let collisionDirection = (o.s.subtract(oo.s)).unit()
    let mo = o.v.scale(o.mass)
    let moo = oo.v.scale(oo.mass)
    let frameOfReference = (mo.add(moo).scale(1 / (o.mass + oo.mass)))
    //console.log(o.v, o.mass, oo.v, oo.mass, frameOfReference)
    let impulse = frameOfReference.subtract(o.v).scale(o.mass * 2)
    //o.receiveImpulse(collisionDirection.scale(10))
    //oo.receiveImpulse(collisionDirection.scale(10).scale(-1))
    if (impulse.dot(collisionDirection) > 0) {
        o.receiveImpulse(impulse, p)
        oo.receiveImpulse(impulse.scale(-1), p)
       // console.log(o.v, impulse)
    }
}
function update(t) {
    let dt = (t - lastTime) / 50
    //objects.forEach((o) => o.checkBounds(500, 500))
    //objects.forEach((o) => o.update(dt))
    objects.forEach((o, i) => {
        o.update(dt)
        o.checkBounds(500, 500)
        o.applyGravity(gravityObjects[0])
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
    //console.log(square.s)
    objects[0].accelerate(keyLog)
    //RectX += RectVelocityX*dt*0.01
    draw()
    lastTime = t
    requestAnimationFrame(update)
}
requestAnimationFrame(update)



