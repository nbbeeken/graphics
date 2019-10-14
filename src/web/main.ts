import { gl, resizeCanvas } from "./canvas"
import { initGui, GUIControls } from "./gui"

import * as twgl from "../../vendor/twgl"

import fs from "../shaders/fs.frag"
import vs from "../shaders/vs.vert"
import { newProjectionMatrix } from "./matrix"

export function main() {
    const guiControls = new GUIControls(1)
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

    const translation = [45, 150, 0] as [number, number, number]
    const rotation = { x: 40, y: 25, z: 325 }
    const scale = [1, 1, 1] as [number, number, number]
    const color = [1, 0, 0, 1]

    let transform = newProjectionMatrix(gl.canvas.width, gl.canvas.height, 1000)
    transform.translate(...translation)
    transform.rotateX(rotation.x)
    transform.rotateY(rotation.y)
    transform.rotateZ(rotation.z)
    transform.scale(...scale)

    let uniforms = {
        time: 0,
        resolution: [gl.canvas.width, gl.canvas.height],
        color,
        transform: transform.internal,
    }

    twgl.setUniforms(programInfo, uniforms)

    function draw(thisTime: number) {
        resizeCanvas(gl)

        const time = thisTime / 1000
        const resolution = [gl.canvas.width, gl.canvas.height]

        uniforms = {
            time,
            resolution,
            color,
            transform: transform.internal,
        }

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        requestAnimationFrame(draw)
    }

    requestAnimationFrame(draw)
}
