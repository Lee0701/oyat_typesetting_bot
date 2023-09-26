
import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { parse } from './command_parser'
import { commands, labels } from './command_handler'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)
labels.forEach((label) => bot.command(label, (ctx) => {
    console.log(parse(ctx.message.text))
}))
bot.launch()
