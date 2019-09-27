import { gl } from "./canvas.js"
import { onNewFile } from "./util.js"


async function main() {
    console.dir(gl)
    onNewFile((contents) => {
        console.log(contents)
    })
}

main()
    .then(() => console.log('success'))
    .catch(console.error)
    .finally(() => console.log('done'))
