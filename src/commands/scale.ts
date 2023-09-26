
import { Command } from '../command_handler'
import { Layer } from '../layer'
import { ScaleLayer } from '../layers/scale'

export class ScaleCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['scale']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const sx = args[0] || 1
        const sy = args[1] || sx
        const layer = stack.pop() as Layer
        const result = new ScaleLayer(layer, sx, sy)
        stack.push(result)
    }
}
