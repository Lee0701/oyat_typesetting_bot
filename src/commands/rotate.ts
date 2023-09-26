
import { Command } from '../command_handler'
import { Layer } from '../layer'
import { RotateLayer } from '../layers'

export class RotateCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['rotate']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const angle = args[0] || 0
        const layer = stack.pop() as Layer
        const result = new RotateLayer(layer, angle)
        stack.push(result)
    }
}
