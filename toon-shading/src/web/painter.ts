import { CanvasTexture } from "three"

export class Painter {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    texture: CanvasTexture
    constructor() {
        this.canvas = document.createElement('canvas')
        this.canvas.height = 256
        this.canvas.width = 256
        this.context = this.canvas.getContext('2d')!

        this.context.fillStyle = '#FF0000'
        this.context.fillRect(0, 0, 256, 256)

        this.texture = new CanvasTexture(this.canvas)
    }
}
