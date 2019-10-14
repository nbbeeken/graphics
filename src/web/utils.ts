export function showError(message?: string): never {
    const errorH3 = document.createElement('h3')
    errorH3.classList.add('error')
    errorH3.innerHTML = message || 'Unknown error'
    document.body.prepend(errorH3)
    throw new Error(message || 'Unknown error')
}

export function radianToDegree(radians: number) {
    return radians * 180 / Math.PI
}

export function degreeToRadian(degree: number) {
    return degree * Math.PI / 180
}

export function makeProjectionMatrix(width: number, height: number, depth: number) {
    return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
    ]
}
