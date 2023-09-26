
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class OverlapLayer implements Layer {
    layers: Layer[]
    constructor(layers: Layer[] = []) {
        this.layers = layers
    }
    render(ctx: CanvasRenderingContext2D) {
        this.layers.forEach(layer => layer.render(ctx))
    }
    clone(): OverlapLayer {
        return new OverlapLayer(this.layers.map(layer => layer.clone()))
    }
}
