import { gl } from './canvas'

async function main(event: Event) {
    window.removeEventListener(event.type, main)
    initShader()
    // gl.enable(gl.SCISSOR_TEST)
    // rainingRect = new Rectangle()
    // requestAnimationFrame(drawAnimation)
    // gl.canvas.addEventListener('click', playerClick as EventListener)
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

function initShader() {
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
    // gl.detachShader(program, vertexShader)
    // gl.detachShader(program, fragmentShader)
    // gl.deleteShader(vertexShader)
    // gl.deleteShader(fragmentShader)

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

/*
    let rainingRect: Rectangle
    let score = 0
    let misses = 0
    function drawAnimation() {
        gl.scissor(rainingRect.position[0], rainingRect.position[1], rainingRect.size[0], rainingRect.size[1])
        gl.clear(gl.COLOR_BUFFER_BIT)
        rainingRect.position[1] -= rainingRect.velocity
        if (rainingRect.position[1] < 0) {
            misses += 1
            document.querySelectorAll('strong')[1].innerHTML = misses.toString()
            rainingRect = new Rectangle()
        }
        // So we reschedule the timeout to call drawAnimation again.
        // Otherwise we won't get any animation.
        requestAnimationFrame(drawAnimation)
    }

    function playerClick(event: MouseEvent) {
        // We need to transform the position of the click event from
        // window coordinates to relative position inside the canvas.
        // In addition we need to remember that vertical position in
        // WebGL increases from bottom to top, unlike in the browser
        // window.
        if (!event.target) {
            return
        }
        const target = event.target as HTMLElement
        const clickPoint = {
            x: event.pageX - target.offsetLeft,
            y: gl.drawingBufferHeight - (event.pageY - target.offsetTop),
        }
        // if the click falls inside the rectangle, we caught it.
        // Increment score and create a new rectangle.
        const diffPos = [clickPoint.x - rainingRect.position[0], clickPoint.y - rainingRect.position[1]]
        if (diffPos[0] >= 0 && diffPos[0] < rainingRect.size[0] && diffPos[1] >= 0 && diffPos[1] < rainingRect.size[1]) {
            score += 1
            document.querySelectorAll('strong')[0].innerHTML = score.toString()
            rainingRect = new Rectangle()
        }
    }

    class Rectangle {
        position: [number, number]
        velocity: number
        color: [number, number, number]
        size: [number, number]
        constructor() {
            // Keeping a reference to the new Rectangle object, rather
            // than using the confusing this keyword.
            // We get three random numbers and use them for new rectangle
            // size and position. For each we use a different number,
            // because we want horizontal size, vertical size and
            // position to be determined independently.
            this.size = [70, 70]
            this.position = [Math.random() * (gl.drawingBufferWidth - this.size[0]), gl.drawingBufferHeight]
            this.velocity = 1.0 + 3.0 * Math.random()
            this.color = [Math.random(), Math.random(), Math.random()]
            gl.clearColor(this.color[0], this.color[1], this.color[2], 1.0)
        }
    }
*/

window.addEventListener('DOMContentLoaded', main)
