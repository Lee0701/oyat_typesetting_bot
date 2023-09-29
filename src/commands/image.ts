
import * as path from 'path'
import { Command, CommandInvocation, IMAGES_DIR } from '../command'
import { ImageLayer, Layer } from '../layers'

export class ImageCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['image']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const filePath = call.args[0] as string
        const result = new ImageLayer(filePath)
        stack.push(result)
    }
}
