
import { Layer } from './layers/layer'
import { CanvasRenderingContext2D } from 'canvas'

export class Document {
    layers: Layer[]
    constructor(layers: Layer[]) {
        this.layers = layers
    }
    render(ctx: CanvasRenderingContext2D) {
        this.layers.forEach(layer => layer.render(ctx))
    }
    clone(): Document {
        return new Document(this.layers.map(layer => layer.clone()))
    }
}
