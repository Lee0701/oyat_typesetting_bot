
import { CanvasRenderingContext2D } from 'canvas'
import { Layer } from '../layer'

export class StringLayer implements Layer {
    str: string
    constructor(str: string) {
        this.str = str
    }
    async render(ctx: CanvasRenderingContext2D): Promise<void> { }
    clone(): StringLayer {
        const result = new StringLayer(this.str)
        return result
    }
}
