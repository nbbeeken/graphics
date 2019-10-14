import * as twgl from "../../vendor/twgl"
const { m4 } = twgl

export function radianToDegree(radians: number) {
    return radians * 180 / Math.PI
}

export function degreeToRadian(degree: number) {
    return degree * Math.PI / 180
}

export function newProjectionMatrix(width: number, height: number, depth: number) {
    return m4.ortho(0, width, height, 0, depth, -depth) as number[]
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
