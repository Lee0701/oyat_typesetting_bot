
import dotenv from 'dotenv'
import * as fs from 'fs/promises'

import { Context, Input, Telegraf } from 'telegraf'
import { Layer } from './layer'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import * as Command from './command'
import { getReplyToContent, invokeCommands } from './command'

dotenv.config()

async function handleCommand(ctx: Context) {
    const msg = ctx.message
    if(!msg) return
    const text = 'text' in msg ? msg.text : 'caption' in msg ? msg.caption : null
    if(!text) return
    try {
        const canvas = createCanvas(512, 512)
        const g = canvas.getContext('2d')

        const stack: Layer[] = []
        const replyToContent = await getReplyToContent(ctx) || ''
        await invokeCommands(ctx, text, replyToContent, stack)
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

async function main() {
    await fs.mkdir(Command.IMAGES_DIR, {recursive: true})
    await fs.mkdir(Command.COMMANDS_DIR, {recursive: true})
    const token = process.env.TELEGRAM_BOT_TOKEN as string
    const bot = new Telegraf(token)
    await Command.loadUserCommandDefinitions()
    const commands = [
        Command.getUserCommandDefinitions(),
        Command.getSystemCommands(),
        Command.getInternalCommands(),
    ]
    commands.forEach((command) => bot.command(command, handleCommand));
    (async () => {
        for await (const _file of fs.watch(Command.COMMANDS_DIR)) {
            await Command.loadUserCommandDefinitions()
            Command.getUserCommandDefinitions().forEach((command) => bot.command(command, handleCommand))
        }
    })()
    bot.launch()
}

if(require.main == module) main()
