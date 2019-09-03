function getRenderingContext(canvas: HTMLCanvasElement) {
    // You MUST initialize canvas height and width to your css expectations (client).
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext

    if (!gl) {
        const errorH3 = document.createElement('h3')
        errorH3.classList.add('error')
        errorH3.innerHTML = 'Failed to get WebGL2 context. Your browser or device may not support WebGL2.'
        document
            .getElementsByTagName('body')
            .item(0)!
            .prepend(errorH3)
        throw new Error('No WebGL2')
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
}

const canvas: HTMLCanvasElement = document.querySelector('canvas')!
export const gl = getRenderingContext(canvas)
