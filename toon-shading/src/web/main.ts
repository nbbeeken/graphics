import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { GUIControls } from './gui'
import { LakeShaderManager } from "./lakes"

var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const gui = new GUIControls()
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    const lakeManager = new LakeShaderManager(gui)

    // Add object to GL Context
    const object = new Mesh(lakeManager.geometry, lakeManager.material)
    scene.add(object)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 5

    object.onBeforeRender = () => {
        // Every time this specific object is drawn we will update the uniforms to create the drawing
        object.material = lakeManager.material // implicitly runs updates
        object.geometry = lakeManager.geometry // mostly a noop
        object.material.needsUpdate = true
    }

    let fps = 30
    let fpsInterval = 1000 / fps
    let then = performance.now()
    function animate() {
        // Animation loop, runs at local computer's FPS
        requestAnimationFrame(animate)
        let now = performance.now()
        let elapsed = now - then
        if (elapsed > fpsInterval) {
            stats.begin()

            then = now - (elapsed % fpsInterval)

            controls.update()
            renderer.render(scene, camera)

            stats.end()
        }
    }
    animate()
}

function onResize() {
    // set the aspect ratio to match the new browser window aspect ratio
    const container = document.getElementsByTagName('main')[0]
    camera.aspect = container.clientWidth / container.clientHeight
    // update the camera's frustum
    camera.updateProjectionMatrix()
    // update the size of the renderer AND the canvas
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)

}
