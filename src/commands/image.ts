
import * as path from 'path'
import { Command, CommandInvocation } from '../command'
import { Layer, NumberLayer, StringLayer } from '../layers'
import { ImageLayer } from '../layers'

export class ImageCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['image']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const layer = stack.pop() as Layer
        const str = layer instanceof StringLayer ? layer.str : layer instanceof NumberLayer ? layer.num.toString() : undefined
        const filePath = (str || call.args[0]) as string
        const isUrl = filePath.startsWith('http://') || filePath.startsWith('https://')
        const result = new ImageLayer(isUrl ? filePath : path.join('data', filePath))
        stack.push(result)
    }
}
