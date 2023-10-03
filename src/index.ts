
import dotenv from 'dotenv'
import * as fs from 'fs/promises'

import { Context, Telegraf } from 'telegraf'
import * as Command from './command'
import { Layer } from './layer'

dotenv.config()

export async function handleCommand(ctx: Context) {
    const msg = ctx.message
    if(!msg) return
    const text = 'text' in msg ? msg.text : 'caption' in msg ? msg.caption : null
    if(!text) return
    try {
        const stack: Layer[] = []
        const result = await Command.invokeCommand(text, await getReplyToContent(ctx) || '', stack)
        if(result !== null) result(ctx)
    } catch(e: any) {
        console.error(e)
        await ctx.reply(e.message)
    }
}

export async function getReplyToContent(ctx: Context): Promise<string|null> {
    const msg = ctx.message
    if(!msg) return null
    if('reply_to_message' in msg && msg.reply_to_message) {
        if('text' in msg.reply_to_message && msg.reply_to_message.text) {
            return msg.reply_to_message.text
        } else if('photo' in msg.reply_to_message && msg.reply_to_message.photo) {
            const photoIndex = msg.reply_to_message.photo.length - 1
            const fileId = msg.reply_to_message.photo[photoIndex].file_id
            return await Command.getFile(await getFileLink(ctx, fileId))
        } else if('document' in msg.reply_to_message && msg.reply_to_message.document) {
            const fileId = msg.reply_to_message.document.file_id
            return await Command.getFile(await getFileLink(ctx, fileId))
        }
    }
    return null
}

async function getFileLink(ctx: Context, fileId: string): Promise<string> {
    const url = await ctx.telegram.getFileLink(fileId)
    return url.href
}

async function main() {
    await fs.mkdir(Command.IMAGES_DIR, {recursive: true})
    await fs.mkdir(Command.COMMANDS_DIR, {recursive: true})
    const token = process.env.TELEGRAM_BOT_TOKEN as string
    const bot = new Telegraf(token)
    await Command.loadUserCommandDefinitions()
    const commands = [
        ...Command.getUserCommandDefinitions(),
        ...Command.getSystemCommands(),
        ...Command.getInternalCommands(),
    ]
    commands.forEach((command) => bot.command(command, handleCommand))
    bot.launch();
    (async () => {
        for await (const _file of fs.watch(Command.COMMANDS_DIR)) {
            await Command.loadUserCommandDefinitions()
            Command.getUserCommandDefinitions().forEach((command) => bot.command(command, handleCommand))
        }
    })()
}

if(require.main == module) main()
