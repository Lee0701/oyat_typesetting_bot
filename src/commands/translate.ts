
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { TranslateLayer } from '../layers/translate'

export class TranslateCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['translate']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const dx = args[0] || 2
        const dy = args[1] || 2
        const layer = stack.pop() as Layer
        const result = new TranslateLayer(layer, dx, dy)
        stack.push(result)
    }
}
