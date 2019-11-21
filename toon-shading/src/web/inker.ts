import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { BackSide } from "three/src/constants"
import { gui } from "./gui"
import { Color } from "three/src/math/Color"

interface InkerUniforms {
    silhouetteColor: { value: Color }
    silhouetteWidth: { value: number }
    [uniform: string]: { value: any }
}

export class Inker {

    get uniforms(): InkerUniforms {
        return {
            silhouetteColor: { value: new Color(gui.silhouetteColor) },
            silhouetteWidth: { value: gui.silhouetteWidth },
        }
    }

    get material() {
        return new ShaderMaterial({
            vertexShader: Inker.vertexShader,
            fragmentShader: Inker.fragmentShader,
            side: BackSide,
            uniforms: this.uniforms
        })
    }

    // Shaders
    static vertexShader = `
        uniform float silhouetteWidth;

        vec4 silhouette(vec4 relativePosition, vec3 relativeNormal) {
            const float ratio = 1.0; // TODO: Change thickness -- artsy styling
            // NOTE: subtract backsidePosition from relativePosition because BackSide relativeNormal is negative
            vec4 backsidePosition = projectionMatrix * modelViewMatrix * vec4(relativePosition.xyz + relativeNormal, 1.0);
            vec4 norm = normalize(relativePosition - backsidePosition);
            return relativePosition + norm * silhouetteWidth * relativePosition.w * ratio;
        }

        void main() {
            vec3 relativeNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
            vec4 relativePosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = silhouette(relativePosition, relativeNormal);
        }
    `
    static fragmentShader = `
        uniform vec3 silhouetteColor;
        void main() {
            gl_FragColor = vec4(silhouetteColor, 1.0);
        }
    `
}
