
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { TranslateLayer } from '../layers/translate'

export class TranslateCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['translate']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const dx = call.args[0] || 0
        const dy = call.args[1] || 0
        const layer = stack.pop() as Layer
        const result = new TranslateLayer(layer, dx, dy)
        stack.push(result)
    }
}
