import * as twgl from "twgl.js"
const { v3 } = twgl

export const LETTER_F: Triangle[] = [
    // left column front
    [[0, 0, 0], [0, 1, 0], [0.2, 0, 0]],
    [[0, 1, 0], [0.2, 1, 0], [0.2, 0, 0]],
    // top rung front
    [[0.2, 0, 0], [0.2, 0.2, 0], [0.6667, 0, 0]],
    [[0.2, 0.2, 0], [0.6667, 0.2, 0], [0.6667, 0, 0]],
    // middle rung front
    [[0.2, 0.4, 0], [0.2, 0.6, 0], [0.44667, 0.4, 0]],
    [[0.2, 0.6, 0], [0.44667, 0.6, 0], [0.44667, 0.4, 0]],
    // left column back
    [[0, 0, 0.2], [0.2, 0, 0.2], [0, 1, 0.2]],
    [[0, 1, 0.2], [0.2, 0, 0.2], [0.2, 1, 0.2]],
    // top rung back
    [[0.2, 0, 0.2], [0.6667, 0, 0.2], [0.2, 0.2, 0.2]],
    [[0.2, 0.2, 0.2], [0.6667, 0, 0.2], [0.6667, 0.2, 0.2]],
    // middle run back
    [[0.2, 0.4, 0.2], [0.44667, 0.4, 0.2], [0.2, 0.6, 0.2]],
    [[0.2, 0.6, 0.2], [0.44667, 0.4, 0.2], [0.44667, 0.6, 0.2]],
    // top
    [[0, 0, 0], [0.6667, 0, 0], [0.6667, 0, 0.2]],
    [[0, 0, 0], [0.6667, 0, 0.2], [0, 0, 0.2]],
    // top rung right
    [[0.6667, 0, 0], [0.6667, 0.2, 0], [0.6667, 0.2, 0.2]],
    [[0.6667, 0, 0], [0.6667, 0.2, 0.2], [0.6667, 0, 0.2]],
    // under top rung
    [[0.2, 0.2, 0], [0.2, 0.2, 0.2], [0.6667, 0.2, 0.2]],
    [[0.2, 0.2, 0], [0.6667, 0.2, 0.2], [0.6667, 0.2, 0]],
    // between top rung and middle
    [[0.2, 0.2, 0], [0.2, 0.4, 0.2], [0.2, 0.2, 0.2]],
    [[0.2, 0.2, 0], [0.2, 0.4, 0], [0.2, 0.4, 0.2]],
    // top of middle rung
    [[0.2, 0.4, 0], [0.44667, 0.4, 0.2], [0.2, 0.4, 0.2]],
    [[0.2, 0.4, 0], [0.44667, 0.4, 0], [0.44667, 0.4, 0.2]],
    // right of middle rung
    [[0.44667, 0.4, 0], [0.44667, 0.6, 0.2], [0.44667, 0.4, 0.2]],
    [[0.44667, 0.4, 0], [0.44667, 0.6, 0], [0.44667, 0.6, 0.2]],
    // bottom of middle rung
    [[0.2, 0.6, 0], [0.2, 0.6, 0.2], [0.44667, 0.6, 0.2]],
    [[0.2, 0.6, 0], [0.44667, 0.6, 0.2], [0.44667, 0.6, 0]],
    // right of bottom
    [[0.2, 0.6, 0], [0.2, 1, 0.2], [0.2, 0.6, 0.2]],
    [[0.2, 0.6, 0], [0.2, 1, 0], [0.2, 1, 0.2]],
    // bottom
    [[0, 1, 0], [0, 1, 0.2], [0.2, 1, 0.2]],
    [[0, 1, 0], [0.2, 1, 0.2], [0.2, 1, 0]],
    // left side
    [[0, 0, 0], [0, 0, 0.2], [0, 1, 0.2]],
    [[0, 0, 0], [0, 1, 0.2], [0, 1, 0]]
]

export const LETTER_F_NORMALS: Vec3[] = (LETTER_F
    .map((triangle: Triangle, index: number) => {
        if (index % 2 === 0) {
            return Array.from(v3.cross(triangle[1], triangle[2])) as Vec3
        } else {
            return false
        }
    })
    .filter((v: Vec3 | false) => v as Vec3) as Vec3[])
    .reduce(repeatItemsReducer<Vec3>(6), [] as Vec3[])

export const LETTER_F_COLORS = [
    // left column front
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 230,
    200, 70, 120, 230,
    200, 70, 120, 230,
    // top rung front
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 230,
    200, 70, 120, 230,
    200, 70, 120, 230,
    // middle rung front
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    200, 70, 120, 255,
    // left column back
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    // top rung back
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    // middle rung back
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    80, 70, 200, 255,
    // top
    70, 200, 210, 255,
    70, 200, 210, 255,
    70, 200, 210, 255,
    70, 200, 210, 255,
    70, 200, 210, 255,
    70, 200, 210, 255,
    // top rung right
    200, 200, 70, 255,
    200, 200, 70, 255,
    200, 200, 70, 255,
    200, 200, 70, 255,
    200, 200, 70, 255,
    200, 200, 70, 255,
    // under top rung
    210, 100, 70, 255,
    210, 100, 70, 255,
    210, 100, 70, 255,
    210, 100, 70, 255,
    210, 100, 70, 255,
    210, 100, 70, 255,
    // between top rung and middle
    210, 160, 70, 255,
    210, 160, 70, 255,
    210, 160, 70, 255,
    210, 160, 70, 255,
    210, 160, 70, 255,
    210, 160, 70, 255,
    // top of middle rung
    70, 180, 210, 255,
    70, 180, 210, 255,
    70, 180, 210, 255,
    70, 180, 210, 255,
    70, 180, 210, 255,
    70, 180, 210, 255,
    // right of middle rung
    100, 70, 210, 255,
    100, 70, 210, 255,
    100, 70, 210, 255,
    100, 70, 210, 255,
    100, 70, 210, 255,
    100, 70, 210, 255,
    // bottom of middle rung.
    76, 210, 100, 255,
    76, 210, 100, 255,
    76, 210, 100, 255,
    76, 210, 100, 255,
    76, 210, 100, 255,
    76, 210, 100, 255,
    // right of bottom
    140, 210, 80, 255,
    140, 210, 80, 255,
    140, 210, 80, 255,
    140, 210, 80, 255,
    140, 210, 80, 255,
    140, 210, 80, 255,
    // bottom
    90, 130, 110, 255,
    90, 130, 110, 255,
    90, 130, 110, 255,
    90, 130, 110, 255,
    90, 130, 110, 255,
    90, 130, 110, 255,
    // left side
    160, 160, 220, 255,
    160, 160, 220, 255,
    160, 160, 220, 255,
    160, 160, 220, 255,
    160, 160, 220, 255,
    160, 160, 220, 255,
]

export type Vec3 = twgl.v3.Vec3
export type Vec4 = [number, number, number, number]
export type Color = Vec4
export type Point = Vec3
export type Triangle = [Point, Point, Point]

export function* toTriangles(shape: number[]): Iterable<Triangle> {
    for (let i = 0; i < shape.length; i += 9) {
        yield [
            shape.slice(i + 0, i + 3) as Point,
            shape.slice(i + 3, i + 6) as Point,
            shape.slice(i + 6, i + 9) as Point,
        ]
    }
}

export function* toPoints(shape: number[]): Iterable<Point> {
    for (let i = 0; i < shape.length; i += 3) {
        yield shape.slice(i + 0, i + 3) as Point
    }
}

export function* fromTriangles(triangles: Iterable<Triangle>): Iterable<Point> {
    for (const triangle of triangles) {
        for (const point of triangle) {
            yield point
        }
    }
}

export function* fromPoints(points: Iterable<Point>): Iterable<number> {
    for (const point of points) {
        for (const n of point) {
            yield n
        }
    }
}

function repeatItemsReducer<T>(n: number) {
    return (accumulator: T[], item: T) => {
        for (let i = 0; i < n; i++) {
            accumulator.push(item)
        }
        return accumulator
    }
}
