
import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { labels, handleCommand } from './command_handler'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)
labels.forEach((label) => bot.command(label, handleCommand))
bot.launch()
