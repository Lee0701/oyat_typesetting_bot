
import { CanvasRenderingContext2D, CanvasTextBaseline, CanvasTextAlign } from 'canvas'
import { Layer } from '../layer'

export class TextLayer implements Layer {
    text: string
    weight: string
    color: string
    font: string
    stroke: number
    baseline: string
    align: string
    constructor(text: string) {
        this.text = Object.entries(ESCAPE_SEQUENCES).reduce((acc, [k, v]) => {
            const regex = new RegExp(k, 'g')
            return acc.replace(regex, v)
        }, text.toString())
        this.weight = 'normal'
        this.color = '#000000'
        this.font = 'sans-serif'
        this.stroke = 0
        this.align = 'left'
        this.baseline ='top'
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        ctx.save()
        const size = ctx.canvas.height
        ctx.textBaseline = this.baseline as CanvasTextBaseline
        ctx.textAlign = this.align as CanvasTextAlign
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
        const result = new TextLayer('')
        result.text = this.text
        result.color = this.color
        result.font = this.font
        result.stroke = this.stroke
        return result
    }
}

export const ESCAPE_SEQUENCES = {
    '\\\\\\\\': '\\',
    '\\\\n': '\n',
    '\\\\t': '\t',
}
