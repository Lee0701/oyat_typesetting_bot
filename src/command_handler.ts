
import { Document } from './document'
import { CommandText } from './commands/text'

export interface Command {
    labels: string[]
    handle(doc: Document, label: string, args: any[]): Document
}

export const commands: Command[] = [
    new CommandText(),
]
export const commandMap: { [label: string]: Command } = Object.fromEntries(
        commands.flatMap((command) => command.labels.map((label) => [label, command])))
export const labels: string[] = commands.flatMap((command) => command.labels)

export interface ParsedCommand {
    label: string
    args: any[]
}

export function handleCommand(parsedCommands: ParsedCommand[]): Document {
    return parsedCommands.reduce((acc: Document, cmd: ParsedCommand) => commandMap[cmd.label].handle(acc, cmd.label, cmd.args), new Document([]))
}
