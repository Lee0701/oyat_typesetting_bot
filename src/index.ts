
import dotenv from 'dotenv'
import { Input, Telegraf } from 'telegraf'
import { parse } from './command_parser'
import { labels, handleCommand } from './command_handler'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)
labels.forEach((label) => bot.command(label, async (ctx) => {
    const parsedCommands: any = parse(ctx.message.text)
    const document = handleCommand(parsedCommands)
    const result = await document.render()
    await ctx.replyWithSticker(Input.fromBuffer(result))
}))
bot.launch()
