import * as twgl from "../../vendor/twgl"
const { m4 } = twgl

export function translation(x: number, y: number, z: number) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        x, y, z, 1,
    ]
}

/**
 * Create a rotation in the X matrix
 * @param angle Angle in Radians
 */
export function rotationX(angle: number) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return [
        +1, +0, +0, +0,
        +0, +c, +s, +0,
        +0, -s, +c, +0,
        +0, +0, +0, +1,
    ]
}

/**
 * Create a rotation in the Y matrix
 * @param angle Angle in Radians
 */
export function rotationY(angle: number) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return [
        +c, +0, -s, +0,
        +0, +1, +0, +0,
        +s, +0, +c, +0,
        +0, +0, +0, +1,
    ]
}

/**
 * Create a rotation in the Z matrix
 * @param angle Angle in Radians
 */
export function rotationZ(angle: number) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return [
        +c, +s, +0, +0,
        -s, +c, +0, +0,
        +0, +0, +1, +0,
        +0, +0, +0, +1,
    ]
}

export function scaling(x: number, y: number, z: number) {
    return [
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1,
    ]
}

export function multiply(a: number[], b: number[]): number[] {
    //@ts-ignore
    return m4.multiply(a, b)
}

export function radianToDegree(radians: number) {
    return radians * 180 / Math.PI
}

export function degreeToRadian(degree: number) {
    return degree * Math.PI / 180
}


export function newProjectionMatrix(width: number, height: number, depth: number) {
    return new Matrix([4, 4],
        [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]
    )
}

export class Matrix {
    public internal: number[]

    constructor(public dimensions: [number, number], matrix?: number[]) {
        this.internal = matrix || new Array(dimensions[0] * dimensions[1])
    }

    public multiplyBy(otherMatrix: Matrix | number[]) {
        if (otherMatrix instanceof Matrix) {
            this.internal = multiply(this.internal, otherMatrix.internal)
        } else {
            this.internal = multiply(this.internal, otherMatrix)
        }
    }

    public translate(x: number, y: number, z: number) {
        this.multiplyBy(translation(x, y, z))
    }

    /**
     * Rotate matrix in the X
     * @param angle Angle in degrees
     */
    public rotateX(angle: number) {
        this.multiplyBy(rotationX(degreeToRadian(angle)))
    }

    /**
     * Rotate matrix in the Y
     * @param angle Angle in degrees
     */
    public rotateY(angle: number) {
        this.multiplyBy(rotationY(degreeToRadian(angle)))
    }

    /**
     * Rotate matrix in the Z
     * @param angle Angle in degrees
     */
    public rotateZ(angle: number) {
        this.multiplyBy(rotationZ(degreeToRadian(angle)))
    }

    public scale(x: number, y: number, z: number) {
        this.multiplyBy(scaling(x, y, z))
    }
}
