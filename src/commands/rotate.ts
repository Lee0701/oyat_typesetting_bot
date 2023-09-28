
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { RotateLayer } from '../layers'

export class RotateCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['rotate']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const angle = call.args[0] || 0
        const layer = stack.pop() as Layer
        const result = new RotateLayer(layer, angle)
        stack.push(result)
    }
}
