
import * as fs from 'fs/promises'
import * as path from 'path'

import * as Commands from './commands'
import { Layer } from './layer'
import { Context, Input } from 'telegraf'

import { parse } from './command_parser'
import { createHash } from 'crypto'
import axios from 'axios'
import { createCanvas } from 'canvas'
import sharp from 'sharp'

export const DATA_DIR = 'data'
export const IMAGES_DIR = path.join(DATA_DIR, 'images')
export const COMMANDS_DIR = path.join(DATA_DIR, 'commands')
export const USER_CMD_EXT = '.json'

export const COMMAND_DEFINE = 'define'
export const COMMAND_UNDEF = 'undef'
export const COMMAND_SHOWDEF = 'showdef'
export const COMMAND_LISTDEF = 'listdef'

export const PREFIX_COMMAND = '/'
export const PREFIX_FROM_REPLY = '^'
export const PREFIX_ARGUMENT = '$'

export async function invokeCommand(text: string, replyToContent: string, stack: Layer[]) {
    const parsed = parse(text)
    return await invokeCommandInvocations(parsed, replyToContent, stack)
}

export async function invokeCommandInvocations(invocations: CommandInvocation[], replyToContent: string, stack: Layer[])
        : Promise<((ctx: Context) => Promise<void>) | null> {

    const preprocessed = preprocessCommandInvocations(invocations, replyToContent)
    const systemCommand = await handleSystemCommand(preprocessed, replyToContent)
    if(systemCommand != null) {
        return async (ctx) => await systemCommand(ctx)
    } else {
        const args = preprocessed[0].args
        await handleCommandInvocations(preprocessed, args, stack)
        return async (ctx) => {
            const webp = await renderCommandInvocations(stack)
            await ctx.replyWithSticker(Input.fromBuffer(webp))
        }
    }
}

export async function getFile(fileLink: string): Promise<string> {
    const {data} = await axios.get(fileLink, {responseType: 'arraybuffer'})
    const fileHash = createHash('sha256').update(data).digest('hex')
    const filePath = path.join(IMAGES_DIR, fileHash.substring(0, 2), fileHash)
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    await fs.writeFile(filePath, data)
    return fileHash
}

export async function handleSystemCommand(invocations: CommandInvocation[], replyToContent: string)
        : Promise<((ctx: Context) => Promise<void>) | null> {

    const command = invocations.shift()
    if(!command) return null
    const label = command.args[0]
    const file = path.join(COMMANDS_DIR, label + USER_CMD_EXT)
    if(command.label == COMMAND_DEFINE) {
        if(replyToContent) {
            const label = 'image'
            const fileHash = path.basename(replyToContent)
            const prefix = fileHash.substring(0, 2)
            const args = [path.join(IMAGES_DIR, prefix, fileHash)]
            await saveCommandInvocation(file, [{label, args}])
            return async (ctx: Context) => {
                ctx.reply(PREFIX_COMMAND + command.args.shift())
            }
        } else {
            await saveCommandInvocation(file, invocations)
            return async (ctx: Context) => {
                ctx.reply(PREFIX_COMMAND + command.args.shift())
            }
        }
    } else if(command.label == COMMAND_UNDEF) {
        await removeCommandInvocation(file)
        return async (ctx: Context) => {
            ctx.reply(PREFIX_COMMAND + command.args.shift())
        }
    } else if(command.label == COMMAND_SHOWDEF) {
        return async (ctx: Context) => {
            ctx.reply(await makeDefinedCommandList(file))
        }
    } else if(command.label == COMMAND_LISTDEF) {
        return async (ctx: Context) => {
            ctx.reply(Object.keys(userCommandDefinitions).join('\n'))
        }
    } else {
        invocations.unshift(command)
    }
    return null
}

export async function renderCommandInvocations(stack: Layer[]): Promise<Buffer> {
    const canvas = createCanvas(512, 512)
    const g = canvas.getContext('2d')

    if(stack.length) {
        const result = stack.pop() as Layer
        await result.render(g)
    }

    const png = canvas.toBuffer('image/png')
    const webp = await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()

    return webp
}

export async function handleCommandInvocations(invocations: CommandInvocation[], callArgs: any[], stack: Layer[]) {
    for(const invocation of invocations) {
        const label = invocation.label
        const args = invocation.args.map((arg) => {
            if(typeof arg === 'string' && arg.startsWith(PREFIX_ARGUMENT)) {
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
            if(arg == PREFIX_FROM_REPLY) {
                return replyToContent
            } else {
                return arg
            }
        })
        return {...invocation, args}
    })
}

export async function loadUserCommandDefinitions() {
    for(const file in userCommandDefinitions) {
        delete userCommandDefinitions[file]
    }
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
    await fs.mkdir(path.dirname(file), {recursive: true})
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
    COMMAND_LISTDEF,
]
