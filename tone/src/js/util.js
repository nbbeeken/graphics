const fileInput = /** @type {HTMLInputElement} */ (document.getElementById('fileInput'))

/**
 * Display error in the dom
 * @param {string=} message
 * @return {never} Throws an error
 */
function showError(message) {
    const errorH3 = document.createElement('h3')
    errorH3.classList.add('error')
    errorH3.innerHTML = message || 'Unknown error'
    document.body.prepend(errorH3)
    throw new Error(message || 'Unknown error')
}

/**
 * @param {(contents: ArrayBuffer) => void} fn
 */
function onNewFile(fn) {
    const reader = new FileReader()
    fileInput.onchange = () => {
        const file = fileInput.files[0]
        reader.onload = (event) => {
            const contents = /** @type {ArrayBuffer} */ (event.target.result)
            fn(contents)
        }
        reader.readAsArrayBuffer(file)
    }
}


export { showError, onNewFile }
