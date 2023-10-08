let canvas = document.getElementById("simulationWindow")
console.log("hi", canvas)
let triangleShape = [new Vec(0, -10), new Vec(5, 10), new Vec(-5, 10)]
let square = new SpaceObject(250, 250, 0, 0, triangleShape)
let rect = new SpaceObject(250, 250, 1, 1, triangleShape)
let lastTime = 0
let keys = {}
// document.addEventListener("keydown", keyListener)
document.addEventListener("keydown", (e) => {keys[e.key] = true})
document.addEventListener("keyup", (e) => {keys[e.key] = false})
let ctx = canvas.getContext("2d")
console.log("hello", ctx)
draw()


let a = new Vec(100,100)
let b = new Vec(400,400)
console.log(a.x , a, a.add(b))

function keyListener(e) {
console.log(e)
square.accelerate(e.key)
draw()
}

function draw() {
    // let triangle = [new Vec(100, 100), new Vec(150, 150), new Vec(50, 150)]
    ctx.fillStyle = "black"
    ctx.clearRect(0, 0, 500, 500)
    // ctx.fillRect(square.s.x-50,square.s.y-50,100,100)
    ctx.fillStyle = "red"
    //ctx.fillRect(square.s.x-550,square.s.y-550,100,100)
    ctx.strokeRect(0, 0, 500, 500)
    //ctx.fillRect(rect.s.x-50, rect.s.y-5, 100, 10)
    const bound = square.s.checkbounds(new Vec(100,100), new Vec(400,400))
    ctx.strokeRect(100,100, bound.x, bound.y)

    sketchShape(square.getShape())

    // ctx.beginPath()
    // ctx.moveTo(triangle[0].x, triangle[0].y)
    // ctx.lineTo(triangle[1].x, triangle[1].y)
    // ctx.lineTo(triangle[2].x, triangle[2].y)
    // ctx.closePath()
    // ctx.stroke()

    function sketchShape(s){
        // console.log(s);
        ctx.beginPath()
        ctx.moveTo(s[0].x, s[0].y)
        s.forEach((v)=> {ctx.lineTo(v.x, v.y)})
        ctx.closePath()
        ctx.stroke()
    }

   // sketchShape(triangle)
}



function update(t) {
    console.log(keys);
//console.log(square.s, rect.s)
    let dt = (t-lastTime)/100
square.checkBounds(new Vec(100,100), new Vec(400,400))
rect.checkBounds(new Vec(100,100), new Vec(400,400))
square.update(dt)
rect.update(dt)
lastTime = t
square.accelerate(keys)
//RectX += RectVelocityX*dt*0.01
draw()
requestAnimationFrame(update)
}
requestAnimationFrame(update)

//function checkBounds() {
    //if(sX < 0) {sX += 500}
    //if(sX > 490) {sX -= 510}
   // if(sY > 490) {sY -= 510}
    //if(sY < 0) {sY += 500}
//}