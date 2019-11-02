import { BoxGeometry, Color, ConeGeometry, CylinderGeometry, DataTexture, Mesh, PerspectiveCamera, RGBFormat, Scene, ShaderMaterial, TorusKnotGeometry, UnsignedByteType, Vector2, Vector3, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { gl } from './canvas'
import { GUIControls } from './gui'
import { fragmentShader, vertexShader } from "./painter"

const resolution = () => [gl.canvas.width, gl.canvas.height] as [number, number]

const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new WebGLRenderer({ canvas: gl.canvas, context: gl })
const gui = new GUIControls()
const BACKGROUND = new Color(0.2, 0.3, 0.3)

const geoSelector = (geometrySelection: 'box' | 'cone' | 'cylinder' | 'torus') => {
    switch (geometrySelection) {
        case 'box': return { g: BoxGeometry, args: [1, 1] }
        case 'cone': return { g: ConeGeometry, args: [1, 1, 10] }
        case 'cylinder': return { g: CylinderGeometry, args: [1, 1, 1, 10] }
        case 'torus': return { g: TorusKnotGeometry, args: [1, 0.3] }
    }
}

export function main() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(BACKGROUND)

    window.addEventListener('resize', onResize)

    let geo = geoSelector(gui.geometry)
    const geometry = new (geo.g)(...geo.args)
    const material = createCustomMaterial()

    const object = new Mesh(geometry, material)
    scene.add(object)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    camera.position.z = 5

    let v = 0.0
    let dv = 0.005
    let lastGeo = gui.geometry
    let lastMat = gui.material
    object.onBeforeRender = () => {
        material.uniforms.resolution.value = new Vector2(...resolution())
        material.uniforms.lightPosition.value = new Vector3(...gui.lightPosition)
        material.uniforms.ambientStrength.value = v

        if (lastMat !== gui.material) {
            lastMat = gui.material
            material.uniforms.myTexture.value = createTextureLakeMap(gui.material)
        }

        if (gui.manualColor) {
            material.uniforms.myTexture.value = new DataTexture(new Uint8Array([
                ...gui.illuminatedColor,
                ...gui.shadowedColor,
            ]), 2, 1, RGBFormat, UnsignedByteType)
        }

        if (lastGeo !== gui.geometry) {
            lastGeo = gui.geometry
            let geometry = geoSelector(gui.geometry)
            object.geometry = new (geometry.g)(...geometry.args)
        }

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
    const material = new ShaderMaterial({
        name: 'toonShader',
        fragmentShader,
        vertexShader,
        uniforms: {
            resolution: { value: new Vector2(...resolution()) },
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            ambientStrength: { value: 0.0 },
            myTexture: { value: createTextureLakeMap(gui.material) },
        },

    })
    material.needsUpdate = true
    return material
}

interface LakeParameters {
    ambientGlobal: Vector3
    ambientLight: Vector3
    diffuseLight: Vector3
    ambientMaterial: Vector3
    diffuseMaterial: Vector3
}

function createTextureLakeMap(materialName: 'ruby' | 'peridot' | 'sapphire') {
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

    const calcColorIlluminated = (m: LakeParameters) => {
        let result = new Vector3(0, 0, 0)
        let temp = new Vector3(0, 0, 0)
        // a_g * a_m
        result.multiplyVectors(m.ambientGlobal, m.ambientMaterial)
        // a_l * a_m
        temp.multiplyVectors(m.ambientLight, m.ambientMaterial)
        // a_g * a_m + a_l * a_m
        result.addVectors(result, temp)
        // d_l * d_m
        temp.multiplyVectors(m.diffuseLight, m.diffuseMaterial)
        // a_g * a_m + a_l * a_m + d_l * d_m
        result.addVectors(result, temp)
        return result
    }
    const calcColorShadowed = (m: LakeParameters) => {
        let result = new Vector3(0)
        let temp = new Vector3(0)
        // a_g * a_m
        result.multiplyVectors(m.ambientGlobal, m.ambientMaterial)
        // a_l * a_m
        temp.multiplyVectors(m.ambientLight, m.ambientMaterial)
        // a_g * a_m + a_l * a_m
        result.addVectors(result, temp)
        return result
    }

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
