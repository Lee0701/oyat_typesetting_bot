
import dotenv from 'dotenv'
import { Context, Input, Telegraf } from 'telegraf'
import { parse } from './command_parser'
import { CommandInvocation, handleCommandInvocations, getInternalCommands, loadUserCommandDefinitions, preprocessCommandInvocations, resolveCommandInvocations, getUserCommandDefinitions } from './command'
import { Layer } from './layer'
import { createCanvas } from 'canvas'
import sharp from 'sharp'
dotenv.config()

async function handleCommand(ctx: Context) {
    const msg = ctx.message
    if(!msg) return
    const text = 'text' in msg ? msg.text : 'caption' in msg ? msg.caption : null
    if(!text) return
    const replyToContent =
            'reply_to_message' in msg && msg.reply_to_message && 'text' in msg.reply_to_message
            ? msg.reply_to_message.text : ''
    try {
        const canvas = createCanvas(512, 512)
        const g = canvas.getContext('2d')

        const stack: Layer[] = []
        await invokeCommands(text, replyToContent, stack)
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

async function invokeCommands(text: string, replyToContent: string, stack: Layer[]) {
    const invocations: CommandInvocation[] = parse(text)
    const preprocessed = preprocessCommandInvocations(invocations, replyToContent)
    const resolved = await resolveCommandInvocations(preprocessed)
    const args = preprocessed[0].args
    await handleCommandInvocations(resolved, args, stack)
}

async function main() {
    const token = process.env.TELEGRAM_BOT_TOKEN as string
    const bot = new Telegraf(token)
    getInternalCommands().forEach((command) => bot.command(command, handleCommand))
    await loadUserCommandDefinitions()
    getUserCommandDefinitions().forEach((command) => bot.command(command, handleCommand))
    bot.launch()
}

if(require.main == module) main()
