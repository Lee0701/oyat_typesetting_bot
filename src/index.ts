
import dotenv from 'dotenv'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'

import p from 'phin'
import { Context, Input, Telegraf } from 'telegraf'
import { parse } from './command_parser'
import * as Command from './command'
import { Layer } from './layer'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
import { createHash } from 'crypto'
import path from 'path'

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
        const replyToContent = await getReplyToContent(ctx) || Command.PREFIX_FROM_REPLY
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

async function getReplyToContent(ctx: Context): Promise<string|null> {
    const msg = ctx.message
    if(!msg) return null
    if('reply_to_message' in msg && msg.reply_to_message) {
        if('text' in msg.reply_to_message && msg.reply_to_message.text) {
            return msg.reply_to_message.text
        } else if('photo' in msg.reply_to_message && msg.reply_to_message.photo) {
            const photoIndex = msg.reply_to_message.photo.length - 1
            const fileId = msg.reply_to_message.photo[photoIndex].file_id
            return await getFile(ctx, fileId)
        } else if('document' in msg.reply_to_message && msg.reply_to_message.document) {
            const fileId = msg.reply_to_message.document.file_id
            return await getFile(ctx, fileId)
        }
    }
    return null
}

async function getFile(ctx: Context, fileId: string): Promise<string> {
    const fileLink = await ctx.telegram.getFileLink(fileId)
    const {body} = await p(fileLink.href)
    const fileHash = createHash('sha256').update(new Uint8Array(body)).digest('hex')
    const filePath = path.join(Command.IMAGES_DIR, fileHash.substring(0, 2), fileHash)
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    if(existsSync(filePath)) return filePath

    await fs.writeFile(filePath, body)
    return fileHash
}

async function invokeCommands(ctx: Context, text: string, replyToContent: string, stack: Layer[]) {
    const invocations: Command.CommandInvocation[] = parse(text)
    const preprocessed = Command.preprocessCommandInvocations(invocations, replyToContent)
    const systemCommand = await Command.handleSystemCommand(preprocessed, replyToContent)
    if(systemCommand !== null) {
        stack.splice(0, stack.length)
        await ctx.reply(systemCommand)
        return
    }
    const args = preprocessed[0].args
    await Command.handleCommandInvocations(preprocessed, args, stack)
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
        for await (const file of fs.watch(Command.COMMANDS_DIR)) {
            await Command.loadUserCommandDefinitions()
            Command.getUserCommandDefinitions().forEach((command) => bot.command(command, handleCommand))
        }
    })()
    bot.launch()
}

if(require.main == module) main()
