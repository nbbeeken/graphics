import { gl } from './canvas'

export function showError(message?: string): never {
    const errorH3 = document.createElement('h3')
    errorH3.classList.add('error')
    errorH3.innerHTML = message || 'Unknown error'
    document.body.prepend(errorH3)
    throw new Error(message || 'Unknown error')
}

const vertexShaderSample = `
#version 100
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 64.0;
}
`.trim()

const fragmentShaderSample = `
#version 100
void main() {
  gl_FragColor = vec4(0.18, 0.54, 0.34, 1.0);
}
`.trim()

export function initShader() {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vertexShader, vertexShaderSample)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fragmentShader, fragmentShaderSample)
    gl.compileShader(fragmentShader)
    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const linkErrLog = gl.getProgramInfoLog(program)
        showError(`Shader program did not link successfully. Error log: ${linkErrLog}`)
    }

    gl.enableVertexAttribArray(0)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0)

    gl.useProgram(program)
    gl.drawArrays(gl.POINTS, 0, 1)

    gl.useProgram(null)
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
}
