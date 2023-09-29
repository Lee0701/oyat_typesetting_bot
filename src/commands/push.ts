
import { Command, CommandInvocation } from '../command'
import { Layer } from '../layer'
import { NumberLayer, StringLayer } from '../layers'

/**
 * Pushes a constant number or string onto the stack.
 * Clones the top element when no arguments are passed.
*/
export class PushCommand implements Command {
    labels: string[]
    constructor() {
        this.labels = ['push']
    }
    async invoke(call: CommandInvocation, stack: Layer[]): Promise<void> {
        const arg = call.args[0]
        const type = typeof arg
        if(type === 'undefined') {
            const top = stack.pop()
            if(top) stack.push(top.clone(), top.clone())
        } else if(type === 'string') {
            stack.push(new StringLayer(arg))
        } else if(type === 'number') {
            stack.push(new NumberLayer(arg))
        }
    }
}
