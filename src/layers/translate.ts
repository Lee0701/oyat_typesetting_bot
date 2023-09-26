
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class TranslateLayer implements Layer {
    layer: Layer
    dx: number
    dy: number
    constructor(layer: Layer, dx: number, dy: number) {
        this.layer = layer
        this.dx = dx
        this.dy = dy
    }
    render(ctx: CanvasRenderingContext2D) {
        ctx.save()
        const dx = this.dx * ctx.canvas.width
        const dy = this.dy * ctx.canvas.height
        ctx.translate(dx, dy)
        this.layer.render(ctx)
        ctx.restore()
    }
    clone(): TranslateLayer {
        return new TranslateLayer(this.layer, this.dx, this.dy)
    }
}
