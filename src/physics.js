let canvas = document.getElementById("simulationWindow")
console.log("hi", canvas)
const triangleShape = [new Vec(0, -50), new Vec(-50, 50), new Vec(50, 50)]
const bulletShape = [new Vec(0, -20), new Vec(-5, 20), new Vec(5, 20)]
const asteroidShape = [new Vec(0, -50), new Vec(50, -20), new Vec(50, 20), new Vec(0, 50), new Vec(-50, 20), new Vec(-50, -20)]
let objects = [
    new SpaceObject(new Vec(250, 250), new Vec(0, 0), triangleShape),
    new SpaceObject(new Vec(450, 50), new Vec(0, 0),  asteroidShape),
    new SpaceObject(new Vec(50, 20), new Vec(0, 0), makeAsteroidShape(50)),
]
let lastTime = 0
let simDelay = 50
let keyLog = {}
document.addEventListener("keydown", keyListener)
document.addEventListener("keydown", (e) => { keyLog[e.key] = true })
document.addEventListener("keyup", (e) => { keyLog[e.key] = false })

let ctx = canvas.getContext("2d")
console.log("hello", ctx)
draw()

//console.log(objects[0].isInside(new Vec(240, 240)), objects[0].isInside(new Vec(30, 30)))
//let a = new Vec(3, 4)
//console.log(a.subtract(new Vec(2, 2)))
//console.log(a.mag())

function keyListener(e) {
    if (e.key == "1") simDelay *= 1.2
    if (e.key == "2") simDelay /= 1.2
    if (e.key == "3") simDelay = 50
}

function draw() {
    //const triangleShape = [[100, 100], [150, 150], [50, 150], [100, 100]]
    ctx.fillStyle = "black"
    ctx.clearRect(0, 0, 500, 500)
    //ctx.fillRect(square.s.x - 50, square.s.y - 50, 100, 100)
    //ctx.fillStyle = "red"
    //ctx.fillRect(square.s.x - 550, square.s.y - 550, 100, 100)
    ctx.strokeRect(0, 0, 500, 500)

    ctx.beginPath()

    function drawShape(s) {
        ctx.moveTo(s[0].x, s[0].y)
        s.forEach((p) => {
            //console.log(p.x, p)
            return ctx.lineTo(p.x, p.y)
        }
        )
        ctx.closePath()
        ctx.stroke()
    }
    //drawShape(triangleShape)
    objects.forEach((o) => drawShape(o.getShape()))
    //drawShape(rect.getShape())
    //drawShape(square.getShape())
    //drawShape(bullet.getShape())
}


function update(t) {
    let dt = (t - lastTime) / simDelay
    objects.forEach((o) => o.checkBounds(500, 500))
    objects.forEach((o) => o.update(dt))
    objects.forEach((o, i) => {
        if (o.ttl < 0) { objects.splice(i, 1)}
    }
    )
    objects.forEach((o, i) => {
        objects.forEach((oo, ii) => {
            if (oo!=o && o.isOneInside(oo.getShape())) {

                o.recieveImpulse(o.s.subtract(oo.s).unit(20))
                oo.recieveImpulse(o.s.subtract(oo.s).unit(-20))
                // o.ttl = 0
                // oo.ttl = 0
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

function makeAsteroidShape(size){
    angle = 0
    points = [new Vec(0, size)]
    while (angle < (2*Math.PI-2)){
        angle += 2*Math.random()
        // console.log(angle);
        points.push(points[0].rotate(angle).scale(Math.random()*0.2 + 0.8))
        // console.log(points);
    }
    return points 
}
makeAsteroidShape(10)

//function checkBounds() {
//if(sX < 0) {sX += 500}
//if(sX > 490) {sX -= 510}
// if(sY > 490) {sY -= 510}
//if(sY < 0) {sY += 500}
//}

