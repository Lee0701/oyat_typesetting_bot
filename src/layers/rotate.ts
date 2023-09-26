
import { Layer } from '../layer'
import { CanvasRenderingContext2D } from 'canvas'

export class RotateLayer implements Layer {
    layer: Layer
    angle: number
    constructor(layer: Layer, angle: number) {
        this.layer = layer
        this.angle = angle
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        ctx.save()
        ctx.translate(ctx.canvas.width/2, ctx.canvas.height/2)
        ctx.rotate(this.angle * Math.PI / 180)
        ctx.translate(-ctx.canvas.width/2, -ctx.canvas.height/2)
        await this.layer.render(ctx)
        ctx.restore()
    }
    clone(): RotateLayer {
        return new RotateLayer(this.layer, this.angle)
    }
}
