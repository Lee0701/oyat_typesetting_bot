
import * as path from 'path'
import { loadImage } from 'canvas'
import { Command } from '../command_handler'
import { Layer } from '../layers'
import { ImageLayer } from '../layers'

export class ImageCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['image']
    }
    async handle(stack: Layer[], label: string, args: any[]): Promise<void> {
        const filePath = path.join('data', args[0])
        try {
            const result = new ImageLayer(await loadImage(filePath))
            stack.push(result)
        } catch(e) {
            console.error(e)
        }
    }
}
