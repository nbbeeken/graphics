import Stats from "stats.js"
import { resizeCanvas, gl } from "./canvas"
import * as twgl from "twgl.js"
import { newProjectionMatrix, translate, rotate, scale } from "./matrix"
import { GUIControls } from "./gui"
import { LETTER_F, LETTER_F_COLORS } from "./shapes"

import fs from "../shaders/fs.frag"
import vs from "../shaders/vs.vert"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export class Renderer {

    lastTime: number = 0
    controls: GUIControls
    animationId?: number
    public programInfo: twgl.ProgramInfo
    public bufferInfo: twgl.BufferInfo

    /**
     * Renderer class to scope variables needed in requestAnimationFrame into a class
     * avoiding deep nesting and confusing code
     */
    constructor() {
        this.controls = new GUIControls()
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs])

        const arrays = {
            position: LETTER_F,
            color: LETTER_F_COLORS,
        }
        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)
    }

    start() {
        this.animationId = requestAnimationFrame(this.render)
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
        }
    }

    /**
     * Main requestAnimation callback, should be responsible for prep to call draw
     * The idea is to keep details about drawing separate from things like canvas resizing and timing
     */
    private render = (thisTime: number) => {
        stats.begin()
        resizeCanvas(gl)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.CULL_FACE)
        this.draw(+(thisTime / 1000).toFixed(5), +(this.lastTime / 1000).toFixed(5))
        this.lastTime = thisTime
        stats.end()
        requestAnimationFrame(this.render)
    }

    /**
     * Drawing callback performs computations needed and sets buffers and uniforms for each frame
     */
    private draw = (thisTime: number, lastTime: number) => {
        const resolution = [gl.canvas.width, gl.canvas.height] as [number, number]

        const projection = newProjectionMatrix(resolution[0], resolution[1], 1000)

        let transform
        transform = translate(projection, this.controls.translation)
        transform = rotate(transform, this.controls.rotation)
        transform = scale(transform, this.controls.scaling)

        // Calc normal

        if (this.controls.animate) {
            // Dance
            this.controls.rotationAnimation()
        }

        let uniforms = {
            time: thisTime,
            resolution,
            transform,
        }

        gl.useProgram(this.programInfo.program)
        twgl.setBuffersAndAttributes(gl, this.programInfo, this.bufferInfo)
        twgl.setUniforms(this.programInfo, uniforms)
        twgl.drawBufferInfo(gl, this.bufferInfo)
    }
}
