import { showError } from "./utils"

const PROXY_ENABLED = false;

export function glCheckErrorProxy(gl: WebGL2RenderingContext) {
    function get(target: WebGL2RenderingContext, key: keyof WebGL2RenderingContext) {
        if (!(key in target)) {
            throw TypeError(`${String(key)} does not exist on ${typeof target}`)
        }

        if (typeof target[key] === 'function') {
            return (...parameters: any[]) => {
                console.debug(`GLCall: ${key} (${parameters.map((v: any) => (v ? v.toString() : 'null')).join(', ')})`)
                const returnValue = (target[key] as Function)(...parameters)
                const errorNum = target.getError()
                if (errorNum !== WebGL2RenderingContext.NO_ERROR) {
                    const errorMessage = `GLError 0x${errorNum.toString(16)}`
                    console.error(errorMessage)
                    debugger // eslint-disable-line no-debugger
                    throw new Error(errorMessage)
                }
                return returnValue
            }
        } else {
            return target[key]
        }
    }
    if (PROXY_ENABLED) {
        return new Proxy(gl, { get })
    } else {
        return gl
    }
}

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

export function resizeCanvas(gl: WebGL2RenderingContext) {
    var realToCSSPixels = window.devicePixelRatio;

    // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawing buffer match it in
    // device pixels.
    var displayWidth = Math.floor((gl.canvas as HTMLCanvasElement).clientWidth * realToCSSPixels);
    var displayHeight = Math.floor((gl.canvas as HTMLCanvasElement).clientHeight * realToCSSPixels);

    // Check if the canvas is not the same size.
    if (gl.canvas.width !== displayWidth ||
        gl.canvas.height !== displayHeight) {

        // Make the canvas the same size
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
}

const canvas = document.getElementById('display') as HTMLCanvasElement;
const gl = getRenderingContext(canvas);

export { gl };
