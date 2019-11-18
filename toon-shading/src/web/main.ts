import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { CylinderGeometry } from "three/src/geometries/CylinderGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { Vector2 } from "three/src/math/Vector2"
import { Vector3 } from "three/src/math/Vector3"
import { Color } from "three/src/math/Color"
import { DataTexture } from "three/src/textures/DataTexture"
import { Mesh } from "three/src/objects/Mesh"
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera"
import { Scene } from "three/src/scenes/Scene"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { UnsignedByteType, RGBFormat } from "three/src/constants"
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import { gl } from './canvas'
import { GUIControls } from './gui'
import { calcColorIlluminated, calcColorShadowed, LakeParameters } from "./lakes"
import { fragmentShader, vertexShader } from "./painter"

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

export async function main() {
    renderer.setClearColor(BACKGROUND_COLOR)

    onResize() // set original size
    window.addEventListener('resize', onResize)

    // Select initial geometry and create material
    let geo = geoSelector(gui.geometry)
    const geometry = new (geo.g)(...geo.args)
    const material = createCustomMaterial()

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
    object.onBeforeRender = () => {
        // Every time this specific object is drawn we will update the uniforms
        // to create the drawing

        material.uniforms['resolution'].value = new Vector2(...resolution())
        material.uniforms['lightPosition'].value = new Vector3(...gui.lightPosition)

        if (lastMat !== gui.material) {
            lastMat = gui.material
            material.uniforms['lakesTexture'].value = createTextureLakeMap(gui.material)
        }

        if (gui.manualColor) {
            material.uniforms['lakesTexture'].value = new DataTexture(new Uint8Array([
                ...gui.illuminatedColor,
                ...gui.shadowedColor,
            ]), 2, 1, RGBFormat, UnsignedByteType)
        }

        if (lastGeo !== gui.geometry) {
            lastGeo = gui.geometry
            let geometry = geoSelector(gui.geometry)
            object.geometry = new (geometry.g)(...geometry.args)
        }

    }

    function animate() {
        // Animation loop, runs at local computer's FPS
        controls.update()
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }
    animate()
}

/**
 * Using custom vertex and fragment shaders this Material will use Lake's
 * runtime algorithm to sample from a texture to shade a given mesh
 */
function createCustomMaterial(): ShaderMaterial {
    const material = new ShaderMaterial({
        name: 'toonShader',
        fragmentShader,
        vertexShader,
        uniforms: {
            resolution: { value: new Vector2(...resolution()) },
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            lakesTexture: { value: createTextureLakeMap(gui.material) },
        },
    })
    material.needsUpdate = true
    return material
}

/**
 * Using Lake's algorithm calculate illuminated and shaded colors for a material
 * The calculations make use of the following parameters:
 *
 * - ambientGlobal: Vector3
 * - ambientLight: Vector3
 * - diffuseLight: Vector3
 * - ambientMaterial: Vector3
 * - diffuseMaterial: Vector3
 *
 * @param materialName Select predetermined material by name
 */
function createTextureLakeMap(materialName: 'ruby' | 'peridot' | 'sapphire' = 'ruby') {
    let material
    switch (materialName) {
        case 'ruby': {
            material = {
                ambientMaterial: new Vector3(44, 3, 3),
                diffuseMaterial: new Vector3(157, 11, 11),
            }
            break
        }
        case 'peridot': {
            material = {
                ambientMaterial: new Vector3(5, 44, 5),
                diffuseMaterial: new Vector3(19, 157, 19),
            }
            break
        }
        case 'sapphire': {
            material = {
                ambientMaterial: new Vector3(10, 10, 150),
                diffuseMaterial: new Vector3(10, 10, 100),
            }
            break
        }
    }

    const lakeParams = {
        ambientGlobal: new Vector3(0.4, 0.4, 0.4),
        ambientLight: new Vector3(0.5, 0.5, 0.5),
        diffuseLight: new Vector3(0.8, 0.8, 0.8),
        ...material
    } as LakeParameters

    const colorIlluminated = calcColorIlluminated(lakeParams).toArray()
    const colorShadowed = calcColorShadowed(lakeParams).toArray()

    return new DataTexture(new Uint8Array([
        ...colorIlluminated,
        ...colorShadowed,
    ]), 2, 1, RGBFormat, UnsignedByteType)
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
