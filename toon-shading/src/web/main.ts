import { Color, Mesh, PerspectiveCamera, Scene, ShaderMaterial, SphereGeometry, Vector2, Vector3, WebGLRenderer } from "three"
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

export function main() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new Color(0.2, 0.3, 0.3))

    window.addEventListener('resize', onResize)

    const geometry = new SphereGeometry(2, 8, 8)
    const material = createCustomMaterial()

    const cube = new Mesh(geometry, material)
    scene.add(cube)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    camera.position.z = 5

    let v = 0.0
    let dv = 0.005
    cube.onBeforeRender = () => {
        const lightColor = new Color(...normalize(gui.color, 255))
        material.uniforms.resolution.value = new Vector2(...resolution())
        material.uniforms.lightColor.value = lightColor
        material.uniforms.lightPosition.value = new Vector3(...gui.lightPosition)
        material.uniforms.ambientStrength.value = v

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
    const painter = new Painter()
    const material = new ShaderMaterial({
        name: 'toonShader',
        fragmentShader,
        vertexShader,
        uniforms: {
            resolution: { value: new Vector2(...resolution()) },
            lightColor: { value: new Color(...gui.color) },
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            ambientStrength: { value: 0.0 }
        }
    })
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
