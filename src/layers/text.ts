
import { CanvasRenderingContext2D } from 'canvas'
import { Layer } from '../layer'

export class TextLayer implements Layer {
    text: string
    weight: string
    color: string
    font: string
    stroke: number
    constructor(text: string) {
        this.text = text
        this.weight = 'normal'
        this.color = '#000000'
        this.font = 'sans-serif'
        this.stroke = 0
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        ctx.save()
        const size = ctx.canvas.height
        ctx.font = `${this.weight} ${size}px ${this.font}`
        if(this.stroke == 0) {
            ctx.fillStyle = this.color
            ctx.fillText(this.text, 0, 0)
        } else {
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.stroke
            ctx.lineJoin = 'round'
            ctx.lineCap = 'round'
            ctx.strokeText(this.text, 0, 0)
        }
        ctx.restore()
    }
    clone(): TextLayer {
        const result = new TextLayer(this.text)
        result.color = this.color
        result.font = this.font
        result.stroke = this.stroke
        return result
    }
}
