import { showError } from "./util.js"

/**
 * Create Webgl context on canvas
 * @param {HTMLCanvasElement} canvas
 * @returns {WebGL2RenderingContext}
 */
function getRenderingContext(canvas) {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const contextOptions = {
        antialias: true,
        powerPreference: 'high-performance',
    }

    const ctx = /** @type {WebGL2RenderingContext} */ (canvas.getContext('webgl2', contextOptions))
    const gl = glCheckErrorProxy(ctx)

    if (!gl) {
        showError('Failed to get WebGL2 context. Your browser or device may not support WebGL2.')
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    return gl
}

/**
 * Set up GL function call logging
 * @param {WebGL2RenderingContext} gl WebGL2 Rendering Context
 * @return {WebGL2RenderingContext}
 */
function glCheckErrorProxy(gl) {
    /**
     *
     * @param {WebGL2RenderingContext} target
     * @param {keyof WebGL2RenderingContext} key
     */
    function get(target, key) {
        if (!(key in target)) {
            throw TypeError(`${String(key)} does not exist on ${typeof target}`)
        }

        if (typeof target[key] === 'function') {
            /**
             * @param {any[]} parameters
             */
            return (...parameters) => {
                console.debug(`GLCall: ${key}(${parameters.map((v) => (v ? v.toString() : 'null')).join(', ')})`)
                // @ts-ignore
                const returnValue = (target[key])(...parameters)
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
    return new Proxy(gl, { get })
}

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('mainCanvas'))
const gl = getRenderingContext(canvas)

export { gl }
