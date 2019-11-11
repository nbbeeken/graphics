import { ImageBitmapLoader } from "three/src/loaders/ImageBitmapLoader"
import DrawingURL from '../assets/img/drawing.png'

export function parseSVG(svgContent: string) {
    const parser = new DOMParser()
    const svg: Document = parser.parseFromString(svgContent, 'image/svg+xml')
    if (svg.getElementsByName('parsererror').length !== 0) {
        throw new Error(`Failed to parse: ${svg.textContent}`)
    }

}

export function parsePNG() {
    const loader = new ImageBitmapLoader()
    loader.load(DrawingURL, (imageBitMap) => {
        console.log(imageBitMap)
        console.dir(imageBitMap)
    })
}
