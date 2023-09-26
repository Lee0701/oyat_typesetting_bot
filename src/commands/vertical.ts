
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { OverlapLayer } from '../layers/overlap'
import { ScaleLayer } from '../layers/scale'
import { TranslateLayer } from '../layers/translate'

export class VerticalCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['vertical']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const n = args[0] || 2
        const layers = stack.splice(stack.length - n, n)
                .map((layer) => new ScaleLayer(layer, 1, 1 / n))
                .map((layer, i) => new TranslateLayer(layer, 0, i / n))
        const result = new OverlapLayer(layers)
        stack.push(result)
    }
}
