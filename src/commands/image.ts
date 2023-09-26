
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
        const n = args[0]
        if(!n) return
        const result = new ImageLayer(await loadImage(`data/agreed.png`))
        stack.push(result)
    }
}
