export function showError(message?: string): never {
    const errorH3 = document.createElement('h3')
    errorH3.classList.add('error')
    errorH3.innerHTML = message || 'Unknown error'
    document.body.prepend(errorH3)
    throw new Error(message || 'Unknown error')
}

export function normalize(array: number[], normalizer?: number) {
    const maxValue = normalizer ? normalizer : Math.max(...array)
    return array.map(v => v / maxValue)
}
