
import { Command } from '../command_handler'
import { Layer } from '../layer'
import { OverlapLayer } from '../layers/overlap'

export class OverlapCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['overlap']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const n = args[0] || 2
        const layers = stack.splice(stack.length - n, n)
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
