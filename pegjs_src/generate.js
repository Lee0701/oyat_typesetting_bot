
const fs = require('fs')
const peggy = require('peggy')
const tspegjs = require('ts-pegjs')

function main(args) {
    const source = fs.readFileSync(args[0], 'utf-8')
    const parser = peggy.generate(source, {
        output: 'source',
        format: 'es',
        plugins: [tspegjs],
    })
    fs.writeFileSync(args[1], parser)
}

if(require.main === module) main(process.argv.slice(2))
