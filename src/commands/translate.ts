
import { Command } from '../command_handler'
import { Layer, TranslatableLayer } from '../layers/layer'

export class CommandTranslate implements Command {
    labels: string[]
    constructor() {
        this.labels = ['translate']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const [dx, dy] = args
        let layer = stack.pop() as Layer
        if('x' in layer && 'y' in layer) {
            const result = layer.clone() as TranslatableLayer
            result.x += dx
            result.y += dy
            stack.push(result)
        } else {
            stack.push(layer)
        }
    }
}
