
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { ScaleLayer } from '../layers'

export class ScaleCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['scale']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const sx = call.args[0] || 1
        const sy = call.args[1] || sx
        const layer = stack.pop() as Layer
        const result = new ScaleLayer(layer, sx, sy)
        stack.push(result)
    }
}
