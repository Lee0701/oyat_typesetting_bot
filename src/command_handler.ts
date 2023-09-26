
import { Context, Input } from 'telegraf'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { parse } from './command_parser'

import { Layer } from './layer'
import { EmptyLayer } from './layers'

import * as Commands from './commands'

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

export interface ParsedCommand {
    label: string
    args: any[]
}

export async function handleCommand(ctx: Context) {
    if(!ctx.message || !('text' in ctx.message)) return
    try {
        const parsedCommands = parse(ctx.message.text)
        const canvas = createCanvas(512, 512)
        const g = canvas.getContext('2d')

        const stack: Layer[] = []
        for(const cmd of parsedCommands) {
            const {label, args} = cmd
            const command = commandMap[label]
            if(!command) throw new Error(`Unknown command: ${label}`)
            await command.handle(stack, label, args)
        }
        const result = stack.pop() || new EmptyLayer()
        await result.render(g)

        const png = canvas.toBuffer('image/png')
        const webp = await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()
        await ctx.replyWithSticker(Input.fromBuffer(webp))
    } catch(e: any) {
        console.error(e)
        await ctx.reply(e.message)
    }
}
