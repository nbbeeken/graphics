import Stats from "stats.js"
import { gl, resizeCanvas } from "./canvas"
import { initGui, GUIControls } from "./gui"

import * as twgl from "../../vendor/twgl"

import fs from "../shaders/fs.frag"
import vs from "../shaders/vs.vert"
import { newProjectionMatrix, translate, rotate, scale } from "./matrix"
import { LETTER_F, LETTER_F_COLORS } from "./shapes"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export function main() {
    let lastTime: number = 0

    const fControls = new GUIControls()
    initGui(fControls)

    const programInfo = twgl.createProgramInfo(gl, [vs, fs])

    const arrays = {
        position: LETTER_F,
        inColor: LETTER_F_COLORS,
    }
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

    function render(thisTime: number) {
        stats.begin()
        resizeCanvas(gl)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.enable(gl.DEPTH_TEST)
        gl.enable(gl.CULL_FACE)
        draw(+(thisTime / 1000).toFixed(5), +(lastTime / 1000).toFixed(5))
        lastTime = thisTime
        stats.end()
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    function draw(thisTime: number, lastTime: number) {
        const resolution = [gl.canvas.width, gl.canvas.height] as [number, number]

        const projection = newProjectionMatrix(resolution[0], resolution[1], 1000)

        let transform
        transform = translate(projection, fControls.translation)
        transform = rotate(transform, fControls.rotation)
        transform = scale(transform, fControls.scaling)

        if (fControls.animate) {
            // Dance
            fControls.rotationX += 1
            fControls.rotationX %= 360

            fControls.rotationY += 1
            fControls.rotationY %= 360

            fControls.rotationZ += 1
            fControls.rotationZ %= 360
        }

        let uniforms = {
            time: thisTime,
            resolution,
            transform,
        }

        gl.useProgram(programInfo.program)
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
        twgl.setUniforms(programInfo, uniforms)
        twgl.drawBufferInfo(gl, bufferInfo)
    }
}
