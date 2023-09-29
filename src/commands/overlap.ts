
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { OverlapLayer } from '../layers'

export class OverlapCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['overlap']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const n = call.args[0] || 2
        const layers = stack.splice(stack.length - n, n)
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
