
import { CanvasRenderingContext2D } from 'canvas'
import { Layer } from '../layer'

export class NumberLayer implements Layer {
    num: number
    constructor(num: number) {
        this.num = num
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> { }
    clone(): NumberLayer {
        const result = new NumberLayer(this.num)
        return result
    }
}
