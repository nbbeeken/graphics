import { TextureLoader } from "three/src/loaders/TextureLoader"

export function parseSVG(svgContent: string) {
    const parser = new DOMParser()
    const svg: Document = parser.parseFromString(svgContent, 'image/svg+xml')
    if (svg.getElementsByName('parsererror').length !== 0) {
        throw new Error(`Failed to parse: ${svg.textContent}`)
    }

}

export async function parsePNG(name: string) {
    return new Promise((resolve, reject) => {
        const loader = new TextureLoader()
        loader.load(name, (texture) => {
            const image = texture.image
            const canvas = document.createElement('canvas')
            canvas.width = image.width
            canvas.height = image.height
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(image, 0, 0, image.width, image.height)
            const pixels = ctx.getImageData(0, 0, image.width, image.height).data
            resolve(pixels)
        })
    })

}

export function* perPixel(array: Uint8ClampedArray): Generator<[number, number, number, number], void, unknown> {
    for (let i = 0; i < array.length; i += 4) {
        yield [
            array[i + 0], // r
            array[i + 1], // g
            array[i + 2], // b
            array[i + 3], // a
        ]
    }
}
