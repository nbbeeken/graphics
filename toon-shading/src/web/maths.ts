import * as twgl from "twgl.js"
const { m4 } = twgl

export function idMat4() {
    return m4.identity()
}

export function radianToDegree(radians: number) {
    return radians * 180 / Math.PI
}

export function degreeToRadian(degree: number) {
    return degree * Math.PI / 180
}

export function perspective(angle: number, [width, height]: [number, number], depth: number = 100.0) {
    return m4.perspective(degreeToRadian(angle), width / height, 0.1, depth)
}

export function translate(matrix: number[] | Float32List, translation: [number, number, number]) {
    return m4.translate(matrix, translation)
}

/**
 * Create rotation matrix from matrix
 * @param matrix The base matrix to create the rotation from
 * @param rotations the x, y, and z rotations in degrees
 */
export function rotate(matrix: number[] | Float32List, { x, y, z }: { x: number, y: number, z: number }) {
    let dest
    dest = m4.rotateX(matrix, degreeToRadian(x))
    dest = m4.rotateY(dest, degreeToRadian(y))
    dest = m4.rotateZ(dest, degreeToRadian(z))
    return dest
}

export function scale(matrix: number[] | Float32List, scaling: [number, number, number]) {
    return m4.scale(matrix, scaling)
}
