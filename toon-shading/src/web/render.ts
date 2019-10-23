import Stats from "stats.js"
import { resizeCanvas, gl } from "./canvas"
import * as twgl from "twgl.js"
import * as wglm from "./maths" // web gl math
import { GUIControls } from "./gui"
import { LETTER_F, LETTER_F_COLORS, LETTER_F_NORMALS, fromPoints, fromTriangles } from "./shapes"

import fs from "../shaders/fs.frag"
import vs from "../shaders/vs.vert"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

interface Object3D {
    bufferInfo: twgl.BufferInfo
    getUniforms: (thisTime: number, resolution: [number, number]) => {
        time: number
        resolution: [number, number]
        [k: string]: number | number[] | Float32Array
    }
}

export class Renderer {

    lastTime: number = 0
    controls: GUIControls
    animationId?: number
    public programInfo: twgl.ProgramInfo
    public objects: Object3D[]

    /**
     * Renderer class to scope variables needed in requestAnimationFrame into a class
     * avoiding deep nesting and confusing code
     */
    constructor() {
        this.controls = new GUIControls()
        this.programInfo = twgl.createProgramInfo(gl, [vs, fs])

        this.objects = [{
            getUniforms: (time, resolution) => ({
                time,
                resolution,
                lightColor: this.controls.color,
                lightPosition: this.controls.lightPosition,
                projection: wglm.perspective(45, resolution, 100.0),
                view: wglm.translate(wglm.idMat4(), this.controls.translation),
                model: wglm.rotate(wglm.idMat4(), this.controls.rotation),

            }),
            bufferInfo: twgl.createBufferInfoFromArrays(gl, {
                position: new Float32Array(fromPoints(fromTriangles(LETTER_F))),
                normal: new Float32Array(fromPoints(LETTER_F_NORMALS)),
                color: new Uint8Array(LETTER_F_COLORS),
            })
        }]
        this.objects.push({
            bufferInfo: twgl.createBufferInfoFromArrays(gl, {
                ...twgl.primitives.createCubeVertices(0.05),
                color: (new Array(24).fill(undefined).map(_ => [255, 255, 255, 255])).flat()
            }),
            getUniforms: (time, resolution) => ({
                time,
                resolution,
                projection: wglm.perspective(45, resolution, 100.0),
                view: wglm.translate(wglm.idMat4(), this.controls.lightPosition)
            })
        })
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
        gl.clearColor(0.2, 0.3, 0.3, 1)
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

        if (this.controls.animate) {
            // Dance
            this.controls.rotationAnimation()
        }

        gl.useProgram(this.programInfo.program)

        for (const object of this.objects) {
            twgl.setBuffersAndAttributes(gl, this.programInfo, object.bufferInfo)
            twgl.setUniforms(this.programInfo, object.getUniforms(thisTime, resolution))
            twgl.drawBufferInfo(gl, object.bufferInfo)
        }
    }
}
