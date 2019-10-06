import { gl, resizeCanvas } from "./canvas.js"
import * as twgl from "./vendor/twgl/twgl-full.js"

function setup() {
    console.log('start')
    const programInfo = twgl.createProgramInfo(gl, ['vs', 'fs'])
    const arrays = {
        position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    }
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays)

    const draw = (thisTime: number) => {
        resizeCanvas(gl)

        const uniforms = {
            time: thisTime * 0.001,
            resolution: [gl.canvas.width, gl.canvas.height],
        };

        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo)
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);

        requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
}

window.addEventListener('DOMContentLoaded', setup)
