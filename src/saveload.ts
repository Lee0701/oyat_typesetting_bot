
import * as fs from 'fs/promises'
import * as path from 'path'

import { ParsedCommand } from './command_handler'

export const DATA_DIR = 'data'
export const USER_CMD_EXT = '.json'

const fileNameCache: Set<string> = new Set()

export async function initFileNameCache(): Promise<void> {
    (await getAllUserCommandFiles()).forEach((name) => fileNameCache.add(name))
}

export function getFileName(uid: string, name: string): string {
    return path.join(DATA_DIR, uid, name + USER_CMD_EXT)
}

export async function remove(file: string): Promise<void> {
    await fs.unlink(file)
    fileNameCache.delete(file)
}

export async function save(file: string, content: string): Promise<void> {
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, content)
    fileNameCache.add(file)
}

export async function load(file: string): Promise<ParsedCommand[]> {
    if(!fileNameCache.has(file)) return []
    const content = await fs.readFile(file, 'utf-8')
    return JSON.parse(content) as ParsedCommand[]
}

export async function getUserCommandFiles(uid: string): Promise<string[]> {
    const list = await fs.readdir(path.join(DATA_DIR, uid))
    const filtered = list.filter((label) => label.endsWith(USER_CMD_EXT))
    return filtered.map((label) => path.join(DATA_DIR, uid, label))
}

export async function getAllUserCommandFiles(): Promise<string[]> {
    const dataDirFiles = await fs.readdir(DATA_DIR)
    const filterPred = async (file: string) => (await fs.stat(path.join(DATA_DIR, file))).isDirectory() ? file : null
    const dataDirDirNames = (await Promise.all(dataDirFiles.map(filterPred))).filter((file) => file) as string[]
    return (await Promise.all(dataDirDirNames.map((dir) => getUserCommandFiles(dir)))).flat()
}