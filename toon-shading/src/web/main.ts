import { Color, Mesh, PerspectiveCamera, Scene, ShaderMaterial, SphereGeometry, Vector2, Vector3, WebGLRenderer, MeshBasicMaterial, DataTexture, RGBFormat, FloatType, FlatShading, BoxGeometry, RGBAFormat, UnsignedByteType, DodecahedronGeometry, TorusKnotGeometry } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { gl } from './canvas'
import { GUIControls } from './gui'
import { fragmentShader, Painter, vertexShader } from "./painter"
import { normalize } from "./utils"

const resolution = () => [gl.canvas.width, gl.canvas.height] as [number, number]

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const gui = new GUIControls()
const BACKGROUND = new Color(0.2, 0.3, 0.3)

export function main() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(BACKGROUND)

    window.addEventListener('resize', onResize)

    const geometry = new TorusKnotGeometry(1, 0.3)
    const material = createCustomMaterial() // new MeshBasicMaterial({ color: 'red', map: painter.illuminatedTexture })

    const cube = new Mesh(geometry, material)
    scene.add(cube)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    camera.position.z = 5

    let v = 0.0
    let dv = 0.005
    cube.onBeforeRender = () => {
        const texture = new DataTexture(new Uint8Array([
            ...gui.color,
            ...[gui.color[0] - 25, gui.color[1] - 25, gui.color[2] - 25],
        ]), 2, 1, RGBFormat, UnsignedByteType)
        material.uniforms.resolution.value = new Vector2(...resolution())
        material.uniforms.lightPosition.value = new Vector3(...gui.lightPosition)
        material.uniforms.ambientStrength.value = v
        material.uniforms.myTexture.value = texture

        if (v > 1) { dv = -dv }
        if (v < 0) { dv = -dv }
        v += dv
    }

    function animate() {
        controls.update()

        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }
    animate()
}

function createCustomMaterial() {
    // const painter = new Painter()
    // painter.scribble()
    // painter.showCanvases()
    const texture = new DataTexture(new Uint8Array([
        ...gui.color,
        ...[gui.color[0] - 25, gui.color[1] - 25, gui.color[2] - 25],
    ]), 2, 1, RGBFormat, UnsignedByteType)
    const material = new ShaderMaterial({
        name: 'toonShader',
        fragmentShader,
        vertexShader,
        uniforms: {
            resolution: { value: new Vector2(...resolution()) },
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            ambientStrength: { value: 0.0 },
            myTexture: { value: texture },
        },

    })
    material.needsUpdate = true
    return material
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
