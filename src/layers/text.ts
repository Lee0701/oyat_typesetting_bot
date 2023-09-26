
import { CanvasRenderingContext2D } from 'canvas'
import { Layer } from './layer'

export class LayerText implements Layer {
    text: string
    x: number
    y: number
    size: number
    font: string
    direction: string
    constructor(text: string, x: number, y: number, size: number) {
        this.text = text
        this.x = x
        this.y = y
        this.size = size
        this.font = 'sans-serif'
        this.direction = 'horizontal'
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.size}px ${this.font}`
        ctx.fillText(this.text, this.x, this.y)
    }
    clone(): LayerText {
        const {text, x, y, size, font, direction} = this
        const result = new LayerText(text, x, y, size)
        result.font = font
        result.direction = direction
        return result
    }
}
