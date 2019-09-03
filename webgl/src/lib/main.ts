import { gl } from './canvas'

let rainingRect: Rectangle
let scoreDisplay: HTMLElement
let missesDisplay: HTMLElement
async function main(event: Event) {
    window.removeEventListener(event.type, main)

    gl.enable(gl.SCISSOR_TEST)
    rainingRect = new Rectangle()
    requestAnimationFrame(drawAnimation)
    gl.canvas.addEventListener('click', playerClick)
    const displays = document.querySelectorAll('strong')
    scoreDisplay = displays[0]
    missesDisplay = displays[1]
}

let score = 0
let misses = 0
function drawAnimation() {
    gl.scissor(rainingRect.position[0], rainingRect.position[1], rainingRect.size[0], rainingRect.size[1])
    gl.clear(gl.COLOR_BUFFER_BIT)
    rainingRect.position[1] -= rainingRect.velocity
    if (rainingRect.position[1] < 0) {
        misses += 1
        missesDisplay.innerHTML = misses.toString()
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
        scoreDisplay.innerHTML = score.toString()
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
        const randomNumbers = getRandomVector()
        this.size = [70, 70]
        this.position = [randomNumbers[2] * (gl.drawingBufferWidth - this.size[0]), gl.drawingBufferHeight]
        this.velocity = 1.0 + 3.0 * Math.random()
        this.color = getRandomVector()
        gl.clearColor(this.color[0], this.color[1], this.color[2], 1.0)
        function getRandomVector(): [number, number, number] {
            return [Math.random(), Math.random(), Math.random()]
        }
    }
}

window.addEventListener('DOMContentLoaded', main)
