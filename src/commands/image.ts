
import * as path from 'path'
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layers'
import { ImageLayer } from '../layers'

export class ImageCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['image']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const filePath = call.args[0]
        const isUrl = filePath.startsWith('http://') || filePath.startsWith('https://')
        const result = new ImageLayer(isUrl ? filePath : path.join('data', filePath))
        stack.push(result)
    }
}
