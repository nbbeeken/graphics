import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { execSync } from 'child_process'
import rimraf from 'rimraf'

const commands = process.argv

if (commands.includes('clean')) {
    // reset project directory
    rimraf.sync('public')
    rimraf.sync('.cache')
}

if (commands.includes('build')) {
    // build typescript -> public/js
    if (!existsSync('public')) {
        mkdirSync('public')
    }

    copyFileSync('src/main.css', 'public/main.css')
    copyFileSync('src/favicon.ico', 'public/favicon.ico')

    try {
        const pugResult = execSync('npx pug -P  src/index.pug -o public', { encoding: 'utf8' })
        const buildResult = execSync('npx tsc -b', { encoding: 'utf8' })
        if (buildResult) {
            console.log(buildResult.output)
        }
    } catch (error) {
        console.error(error.stdout)
    }
    console.log('done.')
}

if (commands.includes('postinstall')) {
    // TODO
}
