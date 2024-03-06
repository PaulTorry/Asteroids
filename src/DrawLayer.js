class DrawLayer {
    constructor(ctx, defaultCol = "black", defaultFont = "15px Arial") {
        this.ctx = ctx
        this.defaultCol = defaultCol
        this.defaultFont = defaultFont
       this.reset()
    }

    reset(){
        this.ctx.clearRect(0, 0, 500, 500)
        this.ctx.strokeRect(0, 0, 500, 500)
        // this.ctx.beginPath()
        this.ctx.fillStyle = this.defaultCol
        this.ctx.strokeStyle = this.defaultCol
        this.ctx.font = this.defaultFont;
        // this.ctx.stroke()
    }

    drawShape(s, dontClose, col = this.defaultCol) {
        this.ctx.strokeStyle = col
        this.ctx.beginPath()
        this.ctx.moveTo(s[0].x, s[0].y)
        s.forEach((p) => {
            return this.ctx.lineTo(p.x, p.y)
        }
        )
        if (!dontClose) { this.ctx.closePath() }
        this.ctx.stroke()
        this.ctx.strokeStyle = this.defaultCol
    }

     drawLineAbs(x1, y1, x2, y2) {
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        // this.ctx.closePath()
        this.ctx.stroke()
    }
    
     drawLineRel(x, y, dx, dy) {
        this.drawLineAbs(x, y, x + dx, y + dy)
    }
    
     drawArrowRel(a, da, col = this.defaultCol) {
        this.ctx.strokeStyle = col
        const end = a.add(da)
        const side1 = da.unit.rotate(Math.PI * 3 / 4).scale(10)
        const side2 = da.unit.rotate(Math.PI * 5 / 4).scale(10)
        this.drawLineRel(a.x, a.y, da.x, da.y)
        this.drawLineRel(end.x, end.y, side1.x, side1.y)
        this.drawLineRel(end.x, end.y, side2.x, side2.y)
        this.ctx.strokeStyle = this.defaultCol
    }

    fillText(text, x, y, col = this.defaultCol){
        this.ctx.fillStyle = "col"
        this.ctx.fillText(text, x, y)
        this.ctx.fillStyle = this.defaultCol
    }

}