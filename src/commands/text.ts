
import { Command } from '../command_handler'
import { Document } from '../document'
import { LayerText } from '../layers/text'

export class CommandText implements Command {
    labels: string[]
    constructor() {
        this.labels = ['text']
    }
    handle(doc: Document, label: string, args: any[]): Document {
        const result = doc.clone()
        const [text, x, y, size, font, direction] = args
        const layer = new LayerText(text, x, y, size)
        layer.font = font || layer.font
        layer.direction = direction || layer.direction
        result.layers.push(layer)
        return result
    }
}
