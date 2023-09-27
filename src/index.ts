
import dotenv from 'dotenv'
import * as path from 'path'
import { Telegraf } from 'telegraf'
import { labels, extraLabels, handleCommand } from './command_handler'
import { USER_CMD_EXT, getAllUserCommandFiles, initFileNameCache } from './saveload'

dotenv.config()

async function main() {
    await initFileNameCache()
    const allLabels: string[] = [...labels, ...extraLabels, ...(await getAllUserCommandFiles())]
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string)
    allLabels.forEach((label) => bot.command(path.basename(label).replace(USER_CMD_EXT, ''), handleCommand))
    bot.launch()
}

if(require.main == module) main()
