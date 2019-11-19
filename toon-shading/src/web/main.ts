import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { CylinderGeometry } from "three/src/geometries/CylinderGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { GUIControls } from './gui'
import { createLakesToonMaterial, createTextureLakeMap, createLakesScribbleMaterial } from "./lakes"

var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const resolution = () => [gl.canvas.width, gl.canvas.height] as [number, number]

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const gui = new GUIControls()
const BACKGROUND_COLOR = new Color(0.2, 0.3, 0.3)

const geoSelector = (geometrySelection: 'box' | 'cone' | 'cylinder' | 'torus') => {
    switch (geometrySelection) {
        case 'box': return { g: BoxGeometry, args: [1, 1] }
        case 'cone': return { g: ConeGeometry, args: [1, 1, 10] }
        case 'cylinder': return { g: CylinderGeometry, args: [1, 1, 1, 10] }
        case 'torus': return { g: TorusKnotGeometry, args: [1, 0.3] }
    }
}

const matSelector = (materialSelection: 'toon' | 'scribble') => {
    return {
        'toon': createLakesToonMaterial(gui),
        'scribble': createLakesScribbleMaterial(gui)
    }[materialSelection]
}

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    // Select initial geometry and create material
    let geo = geoSelector(gui.geometry)
    const geometry = new (geo.g)(...geo.args)
    const material = matSelector(gui.shader)

    // Add object to GL Context
    const object = new Mesh(geometry, material)
    scene.add(object)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 5

    let lastGeo = gui.geometry
    let lastMat = gui.material
    let lastSha = gui.shader
    object.onBeforeRender = () => {
        // Every time this specific object is drawn we will update the uniforms
        // to create the drawing

        if (lastSha !== gui.shader) {
            lastSha = gui.shader
            object.material = matSelector(gui.shader)
        }

        material.uniforms['resolution'].value = new Vector2(...resolution())
        material.uniforms['lightPosition'].value = new Vector3(...gui.lightPosition)

        if (lastMat !== gui.material) {
            lastMat = gui.material
            material.uniforms['lakesTexture'].value = [createTextureLakeMap(gui.material)]
            material.uniforms['textureCount'].value = 1
        }

        if (lastGeo !== gui.geometry) {
            lastGeo = gui.geometry
            let geometry = geoSelector(gui.geometry)
            object.geometry = new (geometry.g)(...geometry.args)
        }

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
