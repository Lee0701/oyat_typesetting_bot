
import { Layer } from '../layer'
import { CanvasRenderingContext2D } from 'canvas'

export class CropLayer implements Layer {
    layer: Layer
    w: number
    h: number
    constructor(layer: Layer, w: number, h: number) {
        this.layer = layer
        this.w = w
        this.h = h
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        ctx.canvas.width = this.w
        ctx.canvas.height = this.h
        await this.layer.render(ctx)
    }
    clone(): CropLayer {
        return new CropLayer(this.layer, this.w, this.h)
    }
}
