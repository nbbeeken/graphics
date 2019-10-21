import * as twgl from "twgl.js"
const { v3 } = twgl

export const LETTER_F = [
    // left column front
    0, 0, 0,
    0, 150, 0,
    30, 0, 0,
    0, 150, 0,
    30, 150, 0,
    30, 0, 0,
    // top rung front
    30, 0, 0,
    30, 30, 0,
    100, 0, 0,
    30, 30, 0,
    100, 30, 0,
    100, 0, 0,
    // middle rung front
    30, 60, 0,
    30, 90, 0,
    67, 60, 0,
    30, 90, 0,
    67, 90, 0,
    67, 60, 0,
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
    30, 60, 30,
    30, 30, 30,
    30, 30, 0,
    30, 60, 0,
    30, 60, 30,
    // top of middle rung
    30, 60, 0,
    67, 60, 30,
    30, 60, 30,
    30, 60, 0,
    67, 60, 0,
    67, 60, 30,
    // right of middle rung
    67, 60, 0,
    67, 90, 30,
    67, 60, 30,
    67, 60, 0,
    67, 90, 0,
    67, 90, 30,
    // bottom of middle rung.
    30, 90, 0,
    30, 90, 30,
    67, 90, 30,
    30, 90, 0,
    67, 90, 30,
    67, 90, 0,
    // right of bottom
    30, 90, 0,
    30, 150, 30,
    30, 90, 30,
    30, 90, 0,
    30, 150, 0,
    30, 150, 30,
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
]

export const LETTER_F_NORMALS: number[] = [...toRectangles(LETTER_F)].map(
    (rectangle: Rectangle) => Array.from(v3.cross(rectangle[0][0], rectangle[0][1])) as Vec3
).reduce(repeatItemsReducer<Point>(6), [] as Point[]).flat(2)

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
export type Rectangle = [Triangle, Triangle]

export function* toTriangles(shape: number[]): Iterable<Triangle> {
    for (let i = 0; i < shape.length; i += 9) {
        yield [
            shape.slice(i + 0, i + 3) as Point,
            shape.slice(i + 3, i + 6) as Point,
            shape.slice(i + 6, i + 9) as Point,
        ]
    }
}

export function* toRectangles(shape: number[]): Iterable<Rectangle> {
    for (let i = 0; i < shape.length; i += 18) {
        yield [
            [
                shape.slice(i + 0, i + 3) as Point,
                shape.slice(i + 3, i + 6) as Point,
                shape.slice(i + 6, i + 9) as Point,
            ],
            [
                shape.slice(i + 9, i + 12) as Point,
                shape.slice(i + 12, i + 15) as Point,
                shape.slice(i + 15, i + 18) as Point,
            ],
        ]
    }
}

export function* toPoints(shape: number[]): Iterable<Point> {
    for (let i = 0; i < shape.length; i += 3) {
        yield shape.slice(i + 0, i + 3) as Point
    }
}

export function* fromRectangles(rectangles: Rectangle[]): Iterable<Triangle> {
    for (const rectangle of rectangles) {
        for (const triangle of rectangle) {
            yield triangle
        }
    }
}

export function* fromTriangles(triangles: Triangle[]): Iterable<Point> {
    for (const triangle of triangles) {
        for (const point of triangle) {
            yield point
        }
    }
}

export function* fromPoints(points: Point[]): Iterable<number> {
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
