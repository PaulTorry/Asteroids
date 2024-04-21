class DrawLayer {
    constructor(ctx, defaultStroke = "black", defaultFill = "white", defaultText = "black") {
        this.ctx = ctx
        this.defaultStroke = defaultStroke
        this.defaultFill = defaultFill
        this.defaultText = defaultText
        // this.screenSize = screenSize
        // this.viewCentre = viewCentre
        // // this.height = height
        // // this.width = width
        // this.reset()
    }
    reset() {
        this.ctx.fillStyle = this.defaultFill
        this.ctx.strokeStyle = this.defaultStroke
        this.ctx.clearRect(0, 0, ...screenSize.add(new Vec(40,40)))
        this.ctx.fillRect(0, 0, ...screenSize)
        this.ctx.strokeRect(0, 0, ...screenSize.add(new Vec(20,20)))
        //ctx.beginPath()
        this.ctx.font = "15px Arial";
    }
    drawLineAbs(x1, y1, x2, y2, col = this.defaultStroke) {
        this.ctx.strokeStyle = col
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        //this.ctx.closePath()
        this.ctx.stroke()
        this.ctx.strokeStyle = this.defaultStroke
    }
    fillText(text, x, y, col = this.defaultText) {
        this.ctx.fillStyle = col
        this.ctx.fillText(text, x, y)
        this.ctx.fillStyle = this.defaultText
    }
    drawLineRel(x, y, dx, dy, col = "white") {
        this.drawLineAbs(x, y, x + dx, y + dy, col)
    }
    drawArrowRel(a, da, col = "white") {
        const end = a.add(da)
        const side1 = da.unit.rotate(Math.PI * 3 / 4).scale(10)
        const side2 = da.unit.rotate(Math.PI * 5 / 4).scale(10)
        this.drawLineRel(a.x, a.y, da.x, da.y, col)
        this.drawLineRel(end.x, end.y, side1.x, side1.y, col)
        this.drawLineRel(end.x, end.y, side2.x, side2.y, col)
    }
    drawShape(s, dontClose, col = this.defaultStroke, offset = new Vec(0,0)) {
        this.ctx.strokeStyle = col
        this.ctx.beginPath()
        this.ctx.moveTo(...s[0].add(offset))
        s.forEach((p) => {
            return this.ctx.lineTo(...p.add(offset))
        }
        )
        if (!dontClose) { this.ctx.closePath() }
        this.ctx.stroke()
        this.ctx.strokeStyle = this.defaultStroke
    }
}