import { Vector3 } from "three/src/math/Vector3"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { DataTexture } from "three/src/textures/DataTexture"
import { RGBFormat, UnsignedByteType } from "three/src/constants"
import { Color } from "three/src/math/Color"

import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { CylinderGeometry } from "three/src/geometries/CylinderGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"

import { fragmentShader, vertexShader, Painter } from "./painter"
import { GUIControls } from "./gui"
import { Texture } from "three/src/textures/Texture"

export interface LakeParameters {
    ambientGlobal: Vector3
    ambientLight: Vector3
    diffuseLight: Vector3
    ambientMaterial: Vector3
    diffuseMaterial: Vector3
}

/**
 * `a_g * a_m + a_l * a_m + d_l * d_m`
 * @param p Lake parameters
 */
export function calcColorIlluminated(p: LakeParameters) {
    let result = new Vector3(0, 0, 0)
    let temp = new Vector3(0, 0, 0)
    // a_g * a_m
    result.multiplyVectors(p.ambientGlobal, p.ambientMaterial)
    // a_l * a_m
    temp.multiplyVectors(p.ambientLight, p.ambientMaterial)
    // a_g * a_m + a_l * a_m
    result.addVectors(result, temp)
    // d_l * d_m
    temp.multiplyVectors(p.diffuseLight, p.diffuseMaterial)
    // a_g * a_m + a_l * a_m + d_l * d_m
    result.addVectors(result, temp)
    return result
}

/**
 * `a_g * a_m + a_l * a_m`
 * @param p Lake Parameters
 */
export function calcColorShadowed(p: LakeParameters) {
    let result = new Vector3(0)
    let temp = new Vector3(0)
    // a_g * a_m
    result.multiplyVectors(p.ambientGlobal, p.ambientMaterial)
    // a_l * a_m
    temp.multiplyVectors(p.ambientLight, p.ambientMaterial)
    // a_g * a_m + a_l * a_m
    result.addVectors(result, temp)
    return result
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
export function createTextureLakeMap(materialName: 'ruby' | 'peridot' | 'sapphire' = 'ruby') {
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

interface LakeUniforms {
    lightPosition: { value: Vector3 }
    lakesTexture: { value: Texture[] }
    textureCount: { value: number }
    [uniform: string]: { value: any }
}

export class LakeShaderManager {
    public box = new BoxGeometry(...[1, 1])
    public cone = new ConeGeometry(...[1, 1, 10])
    public cylinder = new CylinderGeometry(...[1, 1, 1, 10])
    public torus = new TorusKnotGeometry(...[1, 0.3])

    private textures: Texture[] = []
    private painter: Painter = new Painter()

    constructor(
        private gui: GUIControls
    ) { }

    get material() {
        // Run updates on fetch
        return new ShaderMaterial({
            name: `lake${this.gui.material}Shader`,
            fragmentShader,
            vertexShader,
            uniforms: this.getUniforms()
        })
    }

    get geometry() {
        // Saved references to geometries
        return {
            box: this.box,
            cone: this.cone,
            cylinder: this.cylinder,
            torus: this.torus,
        }[this.gui.geometry]
    }

    getUniforms(): LakeUniforms {
        if (this.gui.hasChanged) {
            this.textures = []
            switch (this.gui.material) {
                // Tonal shader selected
                case 'toon':
                    this.textures.push(createTextureLakeMap(this.gui.color))
                    break
                // Scribble shader selected
                case 'scribble':
                    this.painter.color = new Color(...[...createTextureLakeMap(this.gui.color).image.data.slice(0, 3)].map(v => v / 255))
                    this.painter.scribble(this.gui.levels)
                    this.textures.push(...this.painter.illuminationLayers.map(l => l.texture))
                    break
            }
        }
        return {
            lightPosition: { value: new Vector3(...this.gui.lightPosition) },
            lakesTexture: { value: this.textures },
            textureCount: { value: this.textures.length },
        }
    }
}
