
import * as fs from 'fs/promises'
import * as path from 'path'

import * as Commands from './commands'
import { Layer } from './layer'

export const DATA_DIR = 'data'
export const COMMANDS_DIR = path.join(DATA_DIR, 'commands')
export const USER_CMD_EXT = '.json'

export async function handleCommandInvocations(invocations: CommandInvocation[], args: any[], stack: Layer[]) {
    for (const invocation of invocations) {
        const internalCommand = internalCommandsMap[invocation.label] as Command
        if (internalCommand) {
            const newArgs = invocation.args.map((arg, i) => {
                if(typeof arg !== "string") return arg
                if(arg.startsWith("$")) return args[parseInt(arg.substring(1)) - 1]
                return arg
            })
            const newInvocation = {
                label: invocation.label,
                args: newArgs,
            }
            await internalCommand.invoke(newInvocation, stack)
        }
    }
}

export async function resolveCommandInvocations(invocations: CommandInvocation[])
        : Promise<CommandInvocation[]> {

    const result: CommandInvocation[] = []
    for(const invocation of invocations) {
        if(internalCommandsMap[invocation.label]) {
            result.push(invocation)
        } else if(userCommandDefinitions[invocation.label]) {
            const invs = userCommandDefinitions[invocation.label]
            const r = await resolveCommandInvocations(invs)
            result.push(...r)
        }
    }
    return result
}

export function preprocessCommandInvocations(invocations: CommandInvocation[], replyToContent: string): CommandInvocation[] {
    return invocations.map((invocation) => {
        const args = invocation.args.map((arg) => arg == '^' ? replyToContent : arg)
        return {...invocation, args}
    })
}

export async function loadUserCommandDefinitions() {
    const files = await fs.readdir(COMMANDS_DIR)
    for(const f of files) {
        const file = path.join(COMMANDS_DIR, f)
        const stat = await fs.stat(file)
        if(stat.isDirectory()) continue
        const label = path.basename(file, USER_CMD_EXT)
        const invocation = await loadCommandInvocation(file)
        userCommandDefinitions[label] = invocation
    }
}

export async function loadCommandInvocation(file: string): Promise<CommandInvocation[]> {
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content) as CommandInvocation[]
}

export async function saveCommandInvocation(file: string, content: CommandInvocation[]): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, JSON.stringify(content))
}

export async function remove(file: string): Promise<void> {
    await fs.unlink(file)
}

export function getInternalCommands(): string[] {
    return Object.keys(internalCommandsMap)
}

export function getUserCommandDefinitions(): string[] {
    return Object.keys(userCommandDefinitions)
}

export interface CommandInvocation {
    label: string
    args: any[]
}

export interface Command {
    labels: string[]
    invoke(call: CommandInvocation, stack: Layer[]): Promise<void>
}

const userCommandDefinitions: {[label: string]: CommandInvocation[]} = {}

const internalCommandsList: Command[] = [
    new Commands.TextCommand(),
    new Commands.ImageCommand(),
    new Commands.TranslateCommand(),
    new Commands.ScaleCommand(),
    new Commands.OverlapCommand(),
    new Commands.HorizontalCommand(),
    new Commands.VerticalCommand(),
    new Commands.CropCommand(),
    new Commands.RotateCommand(),
]

const internalCommandsMap: {[label: string]: Command} = Object.fromEntries(internalCommandsList.flatMap((command) => {
    return command.labels.map((label) => [label, command])
}))
