
import { Layer } from './layer'
import { CanvasRenderingContext2D } from 'canvas'

export class EmptyLayer implements Layer {
    render(ctx: CanvasRenderingContext2D): void { }
    clone(): EmptyLayer {
        return new EmptyLayer()
    }
}
