export function showError(message?: string): never {
    const errorH3 = document.createElement('h3')
    errorH3.classList.add('error')
    errorH3.innerHTML = message || 'Unknown error'
    document.body.prepend(errorH3)
    throw new Error(message || 'Unknown error')
}

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
    return new Proxy(gl, { get })
}
