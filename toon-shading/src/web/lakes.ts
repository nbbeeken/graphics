import { Vector3 } from "three/src/math/Vector3"

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
