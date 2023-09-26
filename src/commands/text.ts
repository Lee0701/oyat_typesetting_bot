
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { TextLayer } from '../layers/text'

export class CommandText implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const [text, x, y, size, font, direction] = args
        const result = new TextLayer(text, x, y, size)
        result.font = font || result.font
        result.direction = direction || result.direction
        stack.push(result)
    }
}
