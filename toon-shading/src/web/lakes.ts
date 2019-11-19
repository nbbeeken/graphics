import { Vector3 } from "three/src/math/Vector3"
import { Vector2 } from "three/src/math/Vector2"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { DataTexture } from "three/src/textures/DataTexture"
import { RGBFormat, UnsignedByteType } from "three/src/constants"
import { Color } from "three/src/math/Color"

import { fragmentShader, vertexShader, Painter } from "./painter"
import { GUIControls } from "./gui"

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
 * Using custom vertex and fragment shaders this Material will use Lake's
 * runtime algorithm to sample from a texture to shade a given mesh
 */
export function createLakesToonMaterial(gui: GUIControls): ShaderMaterial {
    const uniforms = {
        resolution: { value: new Vector2(0, 0) },
        lightPosition: { value: new Vector3(...gui.lightPosition) },
        lakesTexture: { value: [createTextureLakeMap(gui.material)] },
        textureCount: { value: 1 },
    }
    const material = new ShaderMaterial({
        name: 'toonShader',
        fragmentShader,
        vertexShader,
        uniforms,
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

/**
 * Use scribble textures to create layers of shading replicating artist work
 */
export function createLakesScribbleMaterial(gui: GUIControls): ShaderMaterial {
    const color = createTextureLakeMap(gui.material).image.data.slice(0, 3)
    let p = new Painter(new Color(...color), gui.levels)
    p.scribble()
    p.showCanvases()
    const uniforms = {
        resolution: { value: new Vector2(0, 0) },
        lightPosition: { value: new Vector3(...gui.lightPosition) },
        lakesTexture: { value: p.illuminationLayers.map(l => l.texture) },
        textureCount: { value: gui.levels }
    }
    const material = new ShaderMaterial({
        name: 'scribbleShader',
        vertexShader,
        fragmentShader,
        uniforms,
    })
    material.needsUpdate = true
    return material
}
