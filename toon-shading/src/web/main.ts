import { Color, Mesh, PerspectiveCamera, Scene, ShaderMaterial, SphereGeometry, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import fragmentShader from "../shaders/fs.frag"
import vertexShader from "../shaders/vs.vert"
import { gl } from './canvas'
import { GUIControls } from './gui'
import { Painter } from "./painter"

const resolution = () => [gl.canvas.width, gl.canvas.height] as [number, number]

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const controls = new GUIControls()

export function main() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new Color(0.2, 0.3, 0.3))

    window.addEventListener('resize', onResize)

    const geometry = new SphereGeometry(2, 32, 32)
    const material = createCustomMaterial()

    const cube = new Mesh(geometry, material)
    scene.add(cube)

    const viewControls = new OrbitControls(camera, renderer.domElement)
    viewControls.update()

    camera.position.z = 5

    function animate() {

        material.uniforms = {
            resolution: { value: resolution() },
            lightColor: { value: controls.color },
            lightPosition: { value: controls.lightPosition },
        }
        cube.translateX(controls.translationX)
        cube.translateY(controls.translationY)
        cube.translateZ(controls.translationZ)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        cube.rotation.z += 0.001

        viewControls.update()

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
            resolution: { value: resolution() },
            lightColor: { value: controls.color },
            lightPosition: { value: controls.lightPosition },
        },
        map: painter.texture
    } as any)
    material.uniforms.map = { value: painter.texture };
    (material as any).map = painter.texture

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
