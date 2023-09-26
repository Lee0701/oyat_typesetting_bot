
import { Layer } from './layers/layer'
import { createCanvas } from 'canvas'
import sharp from 'sharp'

export class Document {
    layers: Layer[]
    constructor(layers: Layer[]) {
        this.layers = layers
    }
    async render() {
        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')
        this.layers.forEach(layer => layer.render(ctx))
        const png = canvas.toBuffer('image/png')
        return await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()
    }
    clone(): Document {
        return new Document(this.layers.map(layer => layer.clone()))
    }
}
