import {
    Color,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Vector3,
} from "three"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { TonalObject3D } from "./tonal"
import { gui } from "./gui"
import { OrbitControls } from "./OrbitControls"

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)
const OFFSET_FACTOR = [0, 5000, -5000, 10000, -10000, 15000, -15000, 20000, -20000, 25000, -25000]
const OBJECT_ID_STACK: string[] = []

interface PerfData { fps: number, triangles: number }

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 3200

    let offsetCount = 0
    let linesBeingShown = gui.showLines
    let fps = 0
    let prevTime = performance.now()

    let perfMeasurements: PerfData[] = []
    let output = false

    function animate(nowTime: number) {
        // Animation loop, runs at local computer's FPS
        requestAnimationFrame(animate)
        fps++
        stats.begin()

        const deltaObjectCount = gui.objectCount - scene.children.length
        if (deltaObjectCount !== 0) {
            for (let i = 0; i < Math.abs(deltaObjectCount); i++) {
                if (deltaObjectCount < 0) {
                    // remove
                    if (OBJECT_ID_STACK.length > 0) {
                        scene.remove(scene.getObjectByProperty('uuid', OBJECT_ID_STACK.pop()!)!)
                    }
                    offsetCount--
                } else {
                    // add
                    scene.add(newTonalObject(offsetCount))
                    offsetCount++
                }
            }
        }

        controls.update()
        renderer.setClearColor(gui.clearColor)
        renderer.render(scene, camera)

        if (gui.showLines) {
            linesBeingShown = true
            scene.children.forEach((v) => v instanceof TonalObject3D ? v.addLines() : void 0)
        } else {
            if (linesBeingShown) {
                scene.children.forEach((v) => v instanceof TonalObject3D ? v.removeLines(scene) : void 0)
            }
            linesBeingShown = false
        }

        stats.end()
        if (gui.gather && nowTime > (prevTime + 1000)) {
            prevTime = nowTime
            perfMeasurements.push({ fps, triangles: renderer.info.render.triangles })
            fps = 0
            gui.objectCount += gui.gatherSpeed
        }

        if (perfMeasurements.length > (11 ** 3 / gui.gatherSpeed) && !output) {
            console.table(perfMeasurements)
            let p = document.createElement('p')
            p.textContent = JSON.stringify(perfMeasurements)
            document.body.append(p)
            gui.gather = false
            output = true
        }
    }
    gui.objectCount = 1
    animate(prevTime)
}

function newTonalObject(offsetCount: number) {
    let ng = new TonalObject3D()
    const offset = new Vector3(...[
        Math.floor((offsetCount / OFFSET_FACTOR.length) % OFFSET_FACTOR.length),
        Math.floor(offsetCount % OFFSET_FACTOR.length),
        Math.floor(offsetCount / OFFSET_FACTOR.length ** 2)]
    )
    ng.translateX(OFFSET_FACTOR[offset.x])
    ng.translateY(OFFSET_FACTOR[offset.y])
    ng.translateZ(OFFSET_FACTOR[offset.z])
    scene.add(ng)
    // update
    OBJECT_ID_STACK.push(ng.uuid)
    return ng
}

function onResize() {
    // from three.js resize docs
    // set the aspect ratio to match the new browser window aspect ratio
    const container = document.getElementsByTagName('main')[0]
    camera.aspect = container.clientWidth / container.clientHeight
    // update the camera's frustum
    camera.updateProjectionMatrix()
    // update the size of the renderer AND the canvas
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)

}
