
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { OverlapLayer } from '../layers/overlap'
import { ScaleLayer } from '../layers/scale'
import { TranslateLayer } from '../layers/translate'

export class HorizontalCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['horizontal']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const n = call.args.shift() || 2
        let layers = stack.splice(stack.length - n, n)
        layers = layers.map((layer, i) => new TranslateLayer(layer, i, 0))
        if(call.args.includes('scale')) layers = layers.map((layer) => new ScaleLayer(layer, 1/n, 1/n))
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
