import { Vector3 } from "three/src/math/Vector3"

export interface SubstanceLighting {
    ambientMaterial: Vector3
    diffuseMaterial: Vector3
}
export interface EnvironmentLighting {
    ambientGlobal: Vector3
    ambientLight: Vector3
    diffuseLight: Vector3
}
export interface LakeParameters extends SubstanceLighting, EnvironmentLighting { }
export interface LakeColors { illuminated: [number, number, number], shadowed: [number, number, number] }

export const RUBY: SubstanceLighting = {
    ambientMaterial: new Vector3(44, 3, 3),
    diffuseMaterial: new Vector3(157, 11, 11),
}
export const PERIDOT: SubstanceLighting = {
    ambientMaterial: new Vector3(5, 44, 5),
    diffuseMaterial: new Vector3(19, 157, 19),
}
export const SAPPHIRE: SubstanceLighting = {
    ambientMaterial: new Vector3(10, 10, 150),
    diffuseMaterial: new Vector3(10, 10, 100),
}
const ENV_LIGHT = {
    ambientGlobal: new Vector3(0.4, 0.4, 0.4),
    ambientLight: new Vector3(0.5, 0.5, 0.5),
    diffuseLight: new Vector3(0.8, 0.8, 0.8),
}

export const selectStandardSubstanceLighting = {
    ruby: RUBY,
    peridot: PERIDOT,
    sapphire: SAPPHIRE
}

export const SubstanceOptions = ['ruby', 'peridot', 'sapphire'] as const
export type SupportedSubstances = typeof SubstanceOptions[number]

/**
 * `a_g * a_m + a_l * a_m + d_l * d_m`
 * @param p Lake parameters
 */
export function calcLakeIlluminated(p: LakeParameters) {
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
export function calcLakeShadowed(p: LakeParameters) {
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
export function calculateLakeColors(matLight = RUBY, envLight = ENV_LIGHT): LakeColors {
    const lakeParams = {
        ...envLight,
        ...matLight,
    }
    const illuminated = calcLakeIlluminated(lakeParams).toArray() as [number, number, number]
    const shadowed = calcLakeShadowed(lakeParams).toArray() as [number, number, number]

    return { illuminated, shadowed }
}
