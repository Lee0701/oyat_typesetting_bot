
import { Document } from './document'
import { CommandText } from './commands/text'

export interface Command {
    labels: string[]
    handle(doc: Document, label: string, args: any[]): Document
}

export const commands: Command[] = [
    new CommandText(),
]
export const labels: string[] = commands.flatMap((command) => command.labels)

export function handleCommand(): Document {
    const result = new Document([])
    return result
}
