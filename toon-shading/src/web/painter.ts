import { Color } from "three/src/math/Color"
import { CanvasTexture } from "three/src/textures/CanvasTexture"

interface CanvasTexturePair {
    context: CanvasRenderingContext2D
    texture: CanvasTexture
}

export class Painter {
    illuminationLayers: CanvasTexturePair[]
    color: Color
    constructor(color?: Color) {
        this.color = color || new Color('#FFFFFF')
        const light = Painter.makeTexCanvas(this.color.getStyle())
        const shadow = Painter.makeTexCanvas(this.color.sub(new Color(0.2, 0.2, 0.2)).getStyle())
        this.illuminationLayers = [light, shadow]
    }

    /**
     * Scribbles procedurally on a canvas to create artistic effect
     * @param darkness levels of shadow from 0 to 3
     */
    scribble() {
        for (let level = 0; level < this.illuminationLayers.length; level++) {
            const ctx = this.illuminationLayers[level].context

            ctx.strokeStyle = this.color.getStyle() || 'rgba(0, 0, 0, 1.0)'
            ctx.beginPath()
            ctx.moveTo(0, 0)
            for (let i = 1; i < 120; i++) {
                const args: [number, number] = i % 2 == 0 ? [i * 5, 0] : [0, i * 5]
                ctx.lineTo(...args)
            }
            ctx.stroke()
        }
    }

    showCanvases() {
        for (let i = 0; i < this.illuminationLayers.length; i++) {
            const layer = this.illuminationLayers[i]

            layer.context.canvas.setAttribute('title', `Level ${i}`)
            document.body.append(layer.context.canvas)
        }
    }

    static makeTexCanvas(fillColor?: string): CanvasTexturePair {
        let canvas = document.createElement('canvas')
        canvas.height = 256
        canvas.width = 256
        let context = canvas.getContext('2d')!
        context.fillStyle = fillColor || '#FFFFFF'
        context.fillRect(0, 0, 256, 256)
        let texture = new CanvasTexture(canvas)
        return { context, texture }
    }

}

export const vertexShader = `
out vec3 vertexNormal;
out vec3 vertexPosition;

void main() {
    vertexNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
    vertexPosition = vec3(modelMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
`

export const fragmentShader = `
// Uniforms
uniform vec2 resolution;
uniform float time;

uniform vec3 lightPosition;
uniform sampler2D lakesTexture;

// Inputs
in vec3 vertexNormal;
in vec3 vertexPosition;

// Outputs
// gl_FragColor

// Constants
const vec2 ILLUM_COORD = vec2(0, 0);
const vec2 SHADE_COORD = vec2(1, 0);

// Entry
void main() {
    vec4 illuminatedColor = texture2D(lakesTexture, ILLUM_COORD);
    vec4 shadedColor = texture2D(lakesTexture, SHADE_COORD);

    vec3 normal = normalize(vertexNormal); // n_bar
    vec3 lightDirection = normalize(lightPosition - vertexPosition); // l_bar

    float cosAngIncidence = clamp(
        dot(normal, lightDirection), 0.0, 1.0
    );

    vec3 colorToShadeIn;
    if (cosAngIncidence > 0.5) {
        // illuminated
        colorToShadeIn = vec3(illuminatedColor);
    } else {
        // shaded
        colorToShadeIn = vec3(shadedColor);
    }

    gl_FragColor = vec4(colorToShadeIn, 1.0f);
}
`
