
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { OverlapLayer } from '../layers/overlap'
import { ScaleLayer } from '../layers/scale'
import { TranslateLayer } from '../layers/translate'

export class HorizontalCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['horizontal']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const n = args[0] || 2
        const layers = stack.splice(stack.length - n, n)
                .map((layer) => new ScaleLayer(layer, 1 / n, 1))
                .map((layer, i) => new TranslateLayer(layer, i / n, 0))
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
