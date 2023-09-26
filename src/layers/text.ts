
import { CanvasRenderingContext2D } from 'canvas'
import { Layer } from './layer'

export class TextLayer implements Layer {
    text: string
    x: number
    y: number
    size: number
    font: string
    direction: string
    constructor(text: string) {
        this.text = text
        this.x = 0
        this.y = 0
        this.size = 12
        this.font = 'sans-serif'
        this.direction = 'horizontal'
    }
    render(ctx: CanvasRenderingContext2D): void {
        ctx.font = `${this.size}px ${this.font}`
        ctx.fillText(this.text, this.x, this.y)
    }
    clone(): TextLayer {
        const {text, x, y, size, font, direction} = this
        const result = new TextLayer(text)
        result.x = x
        result.y = y
        result.size = size
        result.font = font
        result.direction = direction
        return result
    }
}
