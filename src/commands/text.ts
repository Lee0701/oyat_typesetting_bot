
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { TextLayer, StringLayer } from '../layers'

export class TextCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const [weight, color, font, stroke, align, baseline] = call.args
        const str = stack.pop() as StringLayer
        const result = new TextLayer(str.str)
        result.weight = weight || result.weight
        result.color = color || result.color
        result.font = font || result.font
        result.stroke = stroke || result.stroke
        result.align = align || result.align
        result.baseline = baseline || result.baseline
        stack.push(result)
    }
}
