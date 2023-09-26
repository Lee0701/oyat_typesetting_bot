
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
        try {
            const filePath = path.join('data', args[0])
            const result = new ImageLayer(filePath)
            stack.push(result)
        } catch(e) {
            console.error(e)
            throw new Error(`Could not load image: ${args[0]}`)
        }
    }
}
