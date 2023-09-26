
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { ScaleLayer } from '../layers/scale'

export class CommandScale implements Command {
    labels: string[]
    constructor() {
        this.labels = ['scale']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const sx = args[0] || 1
        const sy = args[1] || 1
        const layer = stack.pop() as Layer
        const result = new ScaleLayer(layer, sx, sy)
        stack.push(result)
    }
}
