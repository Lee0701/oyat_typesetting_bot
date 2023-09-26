
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class OverlapLayer implements Layer {
    layers: Layer[]
    constructor(layers: Layer[] = []) {
        this.layers = layers
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        for(const layer of this.layers) {
            await layer.render(ctx)
        }
    }
    clone(): OverlapLayer {
        return new OverlapLayer(this.layers.map(layer => layer.clone()))
    }
}
