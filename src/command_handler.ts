
import { Context, Input } from 'telegraf'
import { Message } from 'typegram'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { parse } from './command_parser'

import { Layer } from './layer'
import { EmptyLayer } from './layers'

import * as Commands from './commands'
import { getFileName, save, load, remove } from './saveload'

export interface Command {
    labels: string[]
    handle(stack: Layer[], label: string, args: any[]): Promise<void>
}

export const commands: Command[] = [
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
export const commandMap: { [label: string]: Command } = Object.fromEntries(
        commands.flatMap((command) => command.labels.map((label) => [label, command])))
export const labels: string[] = commands.flatMap((command) => command.labels)
export const extraLabels: string[] = [
    'define', 'undef'
]

export interface ParsedCommand {
    label: string
    args: any[]
}

async function loadUserCommand(uid: string, label: string): Promise<ParsedCommand[]> {
    const file = getFileName(uid, label)
    const content = await load(file)
    return content as ParsedCommand[]
}

async function replaceArgs(ctx: Context, label: string, args: any[]): Promise<any[]> {
    const message = ctx.message as Message
    return Promise.all(args.map(async (arg) => {
        if(arg == '^' && ('reply_to_message' in message)) {
            const replyToMsg = message.reply_to_message
            if(replyToMsg) {
                if('text' in replyToMsg) {
                    return replyToMsg.text
                }
                if('photo' in replyToMsg) {
                    const fileId = replyToMsg.photo[replyToMsg.photo.length - 1].file_id
                    const url = await ctx.telegram.getFileLink(fileId)
                    return url.href
                }
            }
        }
        return arg
    }))
}

export async function executeCommands(ctx: Context, stack: Layer[], parsedCommands: ParsedCommand[]): Promise<void> {
    const uid = ctx.from ? ctx.from.id.toString() : null
    if(uid == null) return

    if(parsedCommands.length) {
        const firstCommand = parsedCommands.shift() as ParsedCommand
        if(firstCommand.label == 'define') {
            const file = getFileName(uid, firstCommand.args[0])
            save(file, JSON.stringify(parsedCommands, null, 4))
        } else if(firstCommand.label == 'undef') {
            const file = getFileName(uid, firstCommand.args[0])
            remove(file)
            return
        } else {
            parsedCommands.unshift(firstCommand)
        }
    }

    for(const cmd of parsedCommands) {
        const {label, args} = cmd
        const userCommand = await loadUserCommand(uid, label)
        if(userCommand.length) {
            await executeCommands(ctx, stack, userCommand)
        } else {
            const command = commandMap[label]
            if(!command) throw new Error(`Unknown command: ${label}`)
            await command.handle(stack, label, await replaceArgs(ctx, label, args))
        }
    }
}

export async function handleCommand(ctx: Context): Promise<void> {
    if(!ctx.message || !('text' in ctx.message)) return
    try {
        const canvas = createCanvas(512, 512)
        const g = canvas.getContext('2d')

        const stack: Layer[] = []
        const parsedCommands = parse(ctx.message.text)
        await executeCommands(ctx, stack, parsedCommands)
        if(stack.length == 0) return
        const result = stack.pop() as Layer
        await result.render(g)

        const png = canvas.toBuffer('image/png')
        const webp = await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()
        await ctx.replyWithSticker(Input.fromBuffer(webp))
    } catch(e: any) {
        console.error(e)
        await ctx.reply(e.message)
    }
}
