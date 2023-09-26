
import { Command } from '../command_handler'
import { Layer } from '../layer'
import { TranslateLayer } from '../layers/translate'

export class TranslateCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['translate']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const dx = args[0] || 0
        const dy = args[1] || 0
        const layer = stack.pop() as Layer
        const result = new TranslateLayer(layer, dx, dy)
        stack.push(result)
    }
}
