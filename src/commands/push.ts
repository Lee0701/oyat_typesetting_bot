
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { NumberLayer, StringLayer } from '../layers'

export class PushCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['push']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const arg = call.args[0]
        if(typeof arg === 'string') stack.push(new StringLayer(arg))
        else if(typeof arg === 'number') stack.push(new NumberLayer(arg))
    }
}
