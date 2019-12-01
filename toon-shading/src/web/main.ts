import { Color } from "three/src/math/Color"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { ToneShadowMesh } from "./toneMesh"
import { gui } from "./gui"

import { PerformanceTonalShading } from "./performance"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)
    const p = new PerformanceTonalShading()
    await p.run(scene)

    // // Add object to GL Context
    // const group = new ToneShadowMesh()
    // scene.add(group)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 3200

    function animate() {
        // Animation loop, runs at local computer's FPS
        requestAnimationFrame(animate)
        stats.begin()

        controls.update()
        renderer.setClearColor(gui.clearColor)
        renderer.render(scene, camera)

        stats.end()
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
