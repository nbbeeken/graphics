function getRenderingContext(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    if (!gl) {
        const warn = document.createElement('h3')
        warn.innerHTML = 'Failed to get WebGL2 context. Your browser or device may not support WebGL2.'
        document
            .getElementsByTagName('body')
            .item(0)!
            .prepend(warn)
        throw new Error('No WebGL2')
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
}

const canvas: HTMLCanvasElement = document.querySelector('canvas')!
export const gl = getRenderingContext(canvas)
