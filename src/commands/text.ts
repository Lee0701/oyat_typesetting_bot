
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { TextLayer } from '../layers/text'

export class TextCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    handle(stack: Layer[], label: string, args: any[]): void {
        const [text, size, font] = args
        const result = new TextLayer(text)
        result.size = size || result.size
        result.font = font || result.font
        result.font = font || result.font
        stack.push(result)
    }
}
