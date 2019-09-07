import { glCheckErrorProxy, showError } from './utils'

function getRenderingContext(canvas: HTMLCanvasElement) {
    // You MUST initialize canvas height and width to your css expectations (client).
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const contextOptions: WebGLContextAttributes = {
        antialias: true,
        powerPreference: 'high-performance',
    }

    const gl = glCheckErrorProxy(canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext)

    if (!gl) {
        showError('Failed to get WebGL2 context. Your browser or device may not support WebGL2.')
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
}

const canvas = document.getElementById('mainDisplay') as HTMLCanvasElement
export const gl = getRenderingContext(canvas)
