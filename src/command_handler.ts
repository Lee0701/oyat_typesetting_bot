
import { Layer } from './layers/layer'
import { EmptyLayer } from './layers/empty'
import { CommandText } from './commands/text'
import { CommandOverlap } from './commands/overlap'
import { CommandTranslate } from './commands/translate'

export interface Command {
    labels: string[]
    handle(stack: Layer[], label: string, args: any[]): void
}

export const commands: Command[] = [
    new CommandText(),
    new CommandOverlap(),
    new CommandTranslate(),
]
export const commandMap: { [label: string]: Command } = Object.fromEntries(
        commands.flatMap((command) => command.labels.map((label) => [label, command])))
export const labels: string[] = commands.flatMap((command) => command.labels)

export interface ParsedCommand {
    label: string
    args: any[]
}

export function handleCommand(parsedCommands: ParsedCommand[]): Layer {
    const stack: Layer[] = []
    parsedCommands.forEach(({label, args}) => {
        const command = commandMap[label]
        command.handle(stack, label, args)
    })
    return stack.pop() || new EmptyLayer()
}
