
import { Layer } from '../layer'
import { CanvasRenderingContext2D } from 'canvas'

export class ScaleLayer implements Layer {
    layer: Layer
    sx: number
    sy: number
    constructor(layer: Layer, sx: number, sy: number) {
        this.layer = layer
        this.sx = sx
        this.sy = sy
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        ctx.save()
        ctx.scale(this.sx, this.sy)
        await this.layer.render(ctx)
        ctx.restore()
    }
    clone(): ScaleLayer {
        return new ScaleLayer(this.layer, this.sx, this.sy)
    }
}
