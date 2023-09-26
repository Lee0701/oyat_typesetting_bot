
import { Context, Input } from 'telegraf'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { parse } from './command_parser'

import { Layer } from './layers/layer'
import { EmptyLayer } from './layers'

import * as Commands from './commands'

export interface Command {
    labels: string[]
    handle(stack: Layer[], label: string, args: any[]): void
}

export const commands: Command[] = [
    new Commands.TextCommand(),
    new Commands.TranslateCommand(),
    new Commands.ScaleCommand(),
    new Commands.OverlapCommand(),
    new Commands.HorizontalCommand(),
    new Commands.VerticalCommand(),
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
    const parsedCommands = parse(ctx.message.text)
    const canvas = createCanvas(512, 512)
    const g = canvas.getContext('2d')

    const stack: Layer[] = []
    parsedCommands.forEach(({label, args}) => {
        const command = commandMap[label]
        command.handle(stack, label, args)
    })
    const result = stack.pop() || new EmptyLayer()
    result.render(g)

    const png = canvas.toBuffer('image/png')
    const webp = await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()
    await ctx.replyWithSticker(Input.fromBuffer(webp))
}
