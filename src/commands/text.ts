
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { TextLayer, StringLayer, NumberLayer } from '../layers'

export class TextCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const [weight, color, font, stroke, align, baseline] = call.args
        const layer = stack.pop() as Layer
        const str = layer instanceof StringLayer ? layer.str : layer instanceof NumberLayer ? layer.num.toString() : undefined
        const result = new TextLayer(str as string)
        result.weight = weight || result.weight
        result.color = color || result.color
        result.font = font || result.font
        result.stroke = stroke || result.stroke
        result.align = align || result.align
        result.baseline = baseline || result.baseline
        stack.push(result)
    }
}
