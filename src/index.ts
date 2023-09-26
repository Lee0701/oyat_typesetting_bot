
import dotenv from 'dotenv'
import { Input, Telegraf } from 'telegraf'
import { parse } from './command_parser'
import { labels, handleCommand } from './command_handler'

import { createCanvas } from 'canvas'
import sharp from 'sharp'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)
labels.forEach((label) => bot.command(label, async (ctx) => {
    const parsedCommands = parse(ctx.message.text)
    const canvas = createCanvas(512, 512)
    const g = canvas.getContext('2d')

    const document = handleCommand(parsedCommands)
    document.render(g)

    const png = canvas.toBuffer('image/png')
    const webp = await sharp(png).ensureAlpha(0).webp({lossless: true}).toBuffer()
    await ctx.replyWithSticker(Input.fromBuffer(webp))
}))
bot.launch()
