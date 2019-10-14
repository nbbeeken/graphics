import { gl, resizeCanvas } from "./canvas"
import { initGui, GUIControls } from "./gui"

import * as twgl from "../../vendor/twgl"

import fs from "../shaders/fs.frag"
import vs from "../shaders/vs.vert"
import { newProjectionMatrix, translate, rotate, scale } from "./matrix"

export function main() {
    const guiControls = new GUIControls()
    initGui(guiControls)
    const programInfo = twgl.createProgramInfo(gl, [vs, fs])
    const arrays = {
        position: new Float32Array([
            // left column front
            0, 0, 0,
            30, 0, 0,
            0, 150, 0,
            0, 150, 0,
            30, 0, 0,
            30, 150, 0,

            // top rung front
            30, 0, 0,
            100, 0, 0,
            30, 30, 0,
            30, 30, 0,
            100, 0, 0,
            100, 30, 0,

            // middle rung front
            30, 60, 0,
            67, 60, 0,
            30, 90, 0,
            30, 90, 0,
            67, 60, 0,
            67, 90, 0,

            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,

            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,

            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,

            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,

            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,

            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,

            // between top rung and middle
            30, 30, 0,
            30, 30, 30,
            30, 60, 30,
            30, 30, 0,
            30, 60, 30,
            30, 60, 0,

            // top of middle rung
            30, 60, 0,
            30, 60, 30,
            67, 60, 30,
            30, 60, 0,
            67, 60, 30,
            67, 60, 0,

            // right of middle rung
            67, 60, 0,
            67, 60, 30,
            67, 90, 30,
            67, 60, 0,
            67, 90, 30,
            67, 90, 0,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 90, 30,
            30, 150, 30,
            30, 90, 0,
            30, 150, 30,
            30, 150, 0,

            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,

            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0,
        ]),
    }
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

    function draw(thisTime: number) {
        resizeCanvas(gl)

        const time = thisTime / 1000
        const resolution = [gl.canvas.width, gl.canvas.height] as [number, number]

        const perspective = newProjectionMatrix(resolution[0], resolution[1], 1000)

        let transform
        transform = translate(perspective, guiControls.translation)
        transform = rotate(transform, guiControls.rotation)
        transform = scale(transform, guiControls.scaling)

        let uniforms = {
            time,
            resolution,
            color: guiControls.color,
            transform,
        }

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
}
