import { showError } from "./utils"

const PROXY_ENABLED = false // Enable for extreme debugging

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
        alpha: true,
        powerPreference: 'high-performance',
    }

    const gl = glCheckErrorProxy(canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext)

    if (!gl) {
        showError('Failed to get WebGL2 context. Your browser or device may not support WebGL2.')
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    return gl
}

const canvas = document.getElementById('display0') as HTMLCanvasElement
const gl = getRenderingContext(canvas)

export { gl }
