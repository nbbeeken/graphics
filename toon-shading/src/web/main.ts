import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { LakeShaderManager } from "./lakes"
import { Inker } from "./inker"
import { Group } from "three/src/objects/Group"

var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    const lakeManager = new LakeShaderManager()
    const inker = new Inker()

    const materials = () => [inker.material, lakeManager.material]
    var group = new Group()

    for (var i = 0, l = materials().length; i < l; i++) {
        group.add(new Mesh(lakeManager.geometry, materials()[i]))
    }

    // Add object to GL Context
    scene.add(group)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 5

    // object.onBeforeRender = () => {
    //     // Every time this specific object is drawn we will update the uniforms to create the drawing
    //     object.material = [inker.material, lakeManager.material] // implicitly runs updates
    //     object.geometry = lakeManager.geometry // mostly a noop
    //     object.material.map(v => v.needsUpdate = true)
    // }

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
