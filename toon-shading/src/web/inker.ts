import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { BackSide } from "three/src/constants"
import { Color } from "three/src/math/Color"
import { Vector3 } from "three/src/math/Vector3"

import { gui } from "./gui"

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
            lightPosition: { value: new Vector3(...gui.lightPosition) },
        }
    }

    get material() {
        return new ShaderMaterial({
            vertexShader: Inker.vertexShader,
            fragmentShader: Inker.fragmentShader,
            side: BackSide,
            uniforms: this.uniforms,
            transparent: true,
        })
    }

    // Shaders
    static vertexShader = `
        uniform float silhouetteWidth;
        uniform vec3 lightPosition;

        out vec3 vertexNormal;
        out vec3 vertexPosition;

        float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        vec4 silhouette(vec4 relativePosition) {
            float ratio = rand(relativePosition.xy); // TODO: Change thickness -- artsy styling

            vec3 offsetSilhouette = relativePosition.xyz + lightPosition;

            vec4 silhouettePosition = projectionMatrix * modelViewMatrix * vec4(offsetSilhouette, 1.0);

            // NOTE: subtract silhouettePosition from relativePosition because BackSide face normals are negative
            vec4 distanceToSilhouette = normalize(relativePosition - silhouettePosition);

            return relativePosition + distanceToSilhouette * silhouetteWidth * relativePosition.w * ratio;
        }

        void main() {
            vertexNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
            vertexPosition = vec3(modelMatrix * vec4(position, 1.0));

            vec4 relativePosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = silhouette(relativePosition);
        }
    `
    static fragmentShader = `
        uniform vec3 silhouetteColor;
        uniform vec3 lightPosition;

        in vec3 vertexNormal;
        in vec3 vertexPosition;

        float lakesTonalShadingSilhouetteAlpha(float cos) {
            if (cos > 0.5) {
                // illuminated
                return 0.0;
            } else {
                // shaded
                return 1.0;
            }
        }
        void main() {
            vec3 normal = normalize(vertexNormal); // n_bar
            vec3 lightDirection = normalize(lightPosition - vertexPosition); // l_bar
            float cos = clamp(dot(normal, lightDirection), 0.0, 1.0);

            gl_FragColor = vec4(silhouetteColor, lakesTonalShadingSilhouetteAlpha(cos));
        }
    `
}
