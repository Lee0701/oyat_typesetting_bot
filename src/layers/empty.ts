
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class EmptyLayer implements Layer {
    async render(ctx: CanvasRenderingContext2D): Promise<void> { }
    clone(): EmptyLayer {
        return new EmptyLayer()
    }
}
