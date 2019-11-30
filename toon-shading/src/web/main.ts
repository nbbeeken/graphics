import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { Group } from "three/src/objects/Group"
import { BufferGeometryLoader } from "three/src/loaders/BufferGeometryLoader"

import * as Stats from "stats.js"

import { gl } from './canvas'
import { Inker } from "./inker"
import { Painter } from "./painter"
import { ShapesSelector } from "./shapes"

var stats = new Stats()
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

    const shapesSelector = new ShapesSelector()
    const painter = new Painter()
    const inker = new Inker()

    const object = new Mesh(shapesSelector.geometry, painter.material)
    const silhouette = new Mesh(shapesSelector.geometry, inker.material)
    const group = new Group()
    group.add(object, silhouette)
    // Add object to GL Context
    scene.add(group)

    // Enable mouse controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // zoom out a bit
    camera.position.z = 3200

    object.onBeforeRender = () => {
        // Every time this specific object is drawn we will update the uniforms to create the drawing
        object.material = painter.material // implicitly runs updates
        object.geometry = shapesSelector.geometry // mostly a noop
        object.material.needsUpdate = true
    }

    silhouette.onBeforeRender = () => {
        // Every time this specific object is drawn we will update the uniforms to create the drawing
        silhouette.material = inker.material // implicitly runs updates
        silhouette.geometry = shapesSelector.geometry // mostly a noop
        silhouette.material.needsUpdate = true
    }

    // Performance
    // const loader = new BufferGeometryLoader()
    // loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/json/suzanne_buffergeometry.json', geometry => {
    //     geometry.computeVertexNormals();
    //     for (let i = 0; i < 500; i++) {
    //         const mesh = new Mesh(geometry, painter.material)
    //         mesh.position.x = Math.random() * 8000 - 4000;
    //         mesh.position.y = Math.random() * 8000 - 4000;
    //         mesh.position.z = Math.random() * 8000 - 4000;
    //         mesh.rotation.x = Math.random() * 2 * Math.PI;
    //         mesh.rotation.y = Math.random() * 2 * Math.PI;
    //         mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50 + 100;
    //         // objects.push(mesh);
    //         mesh.onBeforeRender = function () {
    //             // Every time this specific object is drawn we will update the uniforms to create the drawing
    //             mesh.material = painter.material // implicitly runs updates
    //             mesh.material.needsUpdate = true
    //         }
    //         scene.add(mesh)
    //     }
    // })

    function animate() {
        // Animation loop, runs at local computer's FPS
        requestAnimationFrame(animate)
        stats.begin()

        controls.update()
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
