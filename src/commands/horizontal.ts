
import { Command } from '../command_handler'
import { Layer } from '../layer'
import { OverlapLayer } from '../layers/overlap'
import { ScaleLayer } from '../layers/scale'
import { TranslateLayer } from '../layers/translate'

export class HorizontalCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['horizontal']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const n = args.shift() || 2
        let layers = stack.splice(stack.length - n, n)
        layers = layers.map((layer, i) => new TranslateLayer(layer, i, 0))
        if(args.includes('scale')) layers = layers.map((layer) => new ScaleLayer(layer, 1/n, 1/n))
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
