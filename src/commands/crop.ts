
import { Command } from '../command_handler'
import { CropLayer, Layer } from '../layers'

export class CropCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['crop']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const [w, h] = args
        const layer = stack.pop() as Layer
        const ratio = w /h
        const newW = w > h ? 512 : ratio * 512
        const newH = h > w ? 512 : 1 / ratio * 512
        stack.push(new CropLayer(layer, newW, newH))
    }
}
