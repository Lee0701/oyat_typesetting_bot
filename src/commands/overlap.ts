
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { OverlapLayer } from '../layers/overlap'

export class CommandOverlap implements Command {
    labels: string[]
    constructor() {
        this.labels = ['overlap', '+']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const n = args[0] || 2
        const layers = stack.splice(stack.length - n, n)
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
