import { Color } from "three/src/math/Color"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { TonalObject3D } from "./tonal"
import { gui } from "./gui"
import { Vector3 } from "three"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 3200

    let numOfObjects = 0
    let offset = new Vector3(0, 0, 0)
    const OFFSET_FACTOR = [0, 5000, -5000, 10000, -10000, 15000, -15000, 20000, -20000, 25000, -25000]
    // const OFFSET_FACTOR = [0, ...(new Array(7)).fill(null).map((_, i) => (i % 2 === 0 ? -i : i) * 5000)]
    function animate() {
        // Animation loop, runs at local computer's FPS
        requestAnimationFrame(animate)
        stats.begin()

        if (numOfObjects !== gui.objectCount) {
            for (let i = 0; i < gui.objectCount - numOfObjects; i++) {
                let ng = new TonalObject3D()
                ng.translateX(OFFSET_FACTOR[offset.x])
                ng.translateY(OFFSET_FACTOR[offset.y])
                ng.translateZ(OFFSET_FACTOR[offset.z])
                scene.add(ng)
                // update
                if (offset.x < OFFSET_FACTOR.length - 1) {
                    offset.x += 1
                } else {
                    offset.x = 0
                    if (offset.y < OFFSET_FACTOR.length - 1) {
                        offset.y += 1
                    } else {
                        offset.y = 0
                        if (offset.z < OFFSET_FACTOR.length - 1) {
                            offset.z += 1
                        } else {
                            offset.z = 0
                        }
                    }
                }
            }
            numOfObjects = gui.objectCount
            console.log(renderer.info.render.triangles)
        }

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
