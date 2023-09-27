
import * as path from 'path'
import { Command } from '../command_handler'
import { Layer } from '../layers'
import { ImageLayer } from '../layers'

export class ImageCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['image']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const filePath = args[0]
        const isUrl = filePath.startsWith('http://') || filePath.startsWith('https://')
        const result = new ImageLayer(isUrl ? filePath : path.join('data', filePath))
        stack.push(result)
    }
}
