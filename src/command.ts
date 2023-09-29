
import * as fs from 'fs/promises'
import * as path from 'path'

import * as Commands from './commands'
import { Layer } from './layer'

export const DATA_DIR = 'data'
export const COMMANDS_DIR = path.join(DATA_DIR, 'commands')
export const USER_CMD_EXT = '.json'

export const COMMAND_DEFINE = 'define'
export const COMMAND_UNDEF = 'undef'
export const COMMAND_SHOWDEF = 'showdef'

export async function handleSystemCommand(invocations: CommandInvocation[]): Promise<string|null> {
    const command = invocations.shift()
    if(!command) return null
    const label = command.args[0]
    const file = path.join(COMMANDS_DIR, label + USER_CMD_EXT)
    if(command.label == COMMAND_DEFINE) {
        await saveCommandInvocation(file, invocations)
        return command.args.shift()
    } else if(command.label == COMMAND_UNDEF) {
        await removeCommandInvocation(file)
        return command.args.shift()
    } else if(command.label == COMMAND_SHOWDEF) {
        return await makeDefinedCommandList(file)
    } else {
        invocations.unshift(command)
        return null
    }
}

export async function handleCommandInvocations(invocations: CommandInvocation[], callArgs: any[], stack: Layer[]) {
    for(const invocation of invocations) {
        const label = invocation.label
        const args = invocation.args.map((arg) => {
            if(typeof arg === 'string' && arg.startsWith('$')) {
                const index = parseInt(arg.slice(1)) - 1
                return callArgs[index] || arg
            } else {
                return arg
            }
        })
        if(internalCommandsMap[label]) {
            const internalCommand = internalCommandsMap[label]
            if(internalCommand) await internalCommand.invoke({label, args}, stack)
        } else if(userCommandDefinitions[label]) {
            const invs = userCommandDefinitions[label]
            await handleCommandInvocations(invs, args, stack)
        }
    }
}

export function preprocessCommandInvocations(invocations: CommandInvocation[], replyToContent: string)
        : CommandInvocation[] {

    return invocations.map((invocation) => {
        const args = invocation.args.map((arg) => {
            if(arg == '^') {
                return replyToContent
            } else {
                return arg
            }
        })
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

export async function removeCommandInvocation(file: string): Promise<void> {
    await fs.unlink(file)
}

export async function makeDefinedCommandList(file: string): Promise<string> {
    const content = await fs.readFile(file, 'utf-8')
    const invocations = JSON.parse(content) as CommandInvocation[]
    const result = invocations.map(({label, args}) => `/${label} ${args.join(' ')}`).join('\n')
    return result
}

export function getInternalCommands(): string[] {
    return Object.keys(internalCommandsMap)
}

export function getSystemCommands(): string[] {
    return systemCommands
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
    new Commands.PushCommand(),
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

const systemCommands: string[] = [
    COMMAND_DEFINE,
    COMMAND_UNDEF,
    COMMAND_SHOWDEF,
]
