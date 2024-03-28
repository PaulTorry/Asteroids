class DrawLayer {
    constructor(ctx, defaultStroke = "black", defaultFill = "white", defaultText = "black") {
        this.ctx = ctx
        this.defaultStroke = defaultStroke
        this.defaultFill = defaultFill
        this.defaultText = defaultText
        this.reset()
    }
    reset() {
        this.ctx.fillStyle = this.defaultFill
        this.ctx.strokeStyle = this.defaultStroke
        this.ctx.clearRect(0, 0, 500, 500)
        this.ctx.fillRect(0, 0, 500, 500)
        this.ctx.strokeRect(0, 0, 500, 500)
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
    drawLineRel(x, y, dx, dy) {
        this.drawLineAbs(x, y, x + dx, y + dy)
    }
    drawArrowRel(a, da, col = "white") {
        this.ctx.strokeStyle = col
        const end = a.add(da)
        const side1 = da.unit.rotate(Math.PI * 3 / 4).scale(10)
        const side2 = da.unit.rotate(Math.PI * 5 / 4).scale(10)
        this.drawLineRel(a.x, a.y, da.x, da.y, col)
        this.drawLineRel(end.x, end.y, side1.x, side1.y, col)
        this.drawLineRel(end.x, end.y, side2.x, side2.y, col)
        this.ctx.strokeStyle = this.defaultStroke
    }
    drawShape(s, dontClose, col = this.defaultStroke) {
        this.ctx.strokeStyle = col
        this.ctx.beginPath()
        this.ctx.moveTo(s[0].x, s[0].y)
        s.forEach((p) => {
            return this.ctx.lineTo(p.x, p.y)
        }
        )
        if (!dontClose) { this.ctx.closePath() }
        this.ctx.stroke()
        this.ctx.strokeStyle = this.defaultStroke
    }
}