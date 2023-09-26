
import { Command } from '../command_handler'
import { Layer } from '../layers/layer'
import { TextLayer } from '../layers/text'

export class TextCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const [text, weight, color, font, stroke] = args
        const result = new TextLayer(text)
        result.weight = weight || result.weight
        result.color = color || result.color
        result.font = font || result.font
        result.stroke = stroke || result.stroke
        stack.push(result)
    }
}
