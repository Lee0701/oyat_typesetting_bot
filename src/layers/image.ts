
import { loadImage } from 'canvas'
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class ImageLayer implements Layer {
    imagePath: string
    constructor(imagePath: string) {
        this.imagePath = imagePath
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> {
        try {
            const image = await loadImage(this.imagePath)
            ctx.drawImage(image, 0, 0, image.width, image.height)
        } catch(e) {
            console.error(e)
        }
    }
    clone(): ImageLayer {
        return new ImageLayer(this.imagePath)
    }
}
