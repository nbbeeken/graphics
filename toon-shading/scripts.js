import rimraf from 'rimraf'

const commands = process.argv

if (commands.includes('clean')) {
    // reset project directory
    rimraf.sync('public')
    rimraf.sync('dist')
    rimraf.sync('.cache')
}
