
import { Image } from 'canvas'
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class ImageLayer implements Layer {
    image: Image
    constructor(image: Image) {
        this.image = image
    }
    render(ctx: CanvasRenderingContext2D): void {
        console.log(this.image)
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
    }
    clone(): ImageLayer {
        return new ImageLayer(this.image)
    }
}
