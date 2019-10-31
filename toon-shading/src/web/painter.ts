import { CanvasTexture, Color } from "three"

interface TwoTexCanvas {
    light: {
        context: CanvasRenderingContext2D
        texture: CanvasTexture
    }
    shadow: {
        context: CanvasRenderingContext2D
        texture: CanvasTexture
    }
}

export class Painter {
    canvases: TwoTexCanvas
    color: Color
    constructor(color?: Color) {
        this.color = color || new Color('#FFFFFF')
        const light = Painter.makeTexCanvas(this.color.getStyle())
        const shadow = Painter.makeTexCanvas(this.color.sub(new Color(0.2, 0.2, 0.2)).getStyle())
        this.canvases = { light, shadow }
    }

    get illuminatedTexture() { return this.canvases.light.texture }
    get shadowedTexture() { return this.canvases.shadow.texture }

    scribble() {
        const ctx = this.canvases.light.context

        ctx.strokeStyle = this.color.getStyle() || 'rgba(0, 0, 0, 1.0)'
        ctx.beginPath()
        ctx.moveTo(0, 0)
        for (let i = 1; i < 120; i++) {
            const args: [number, number] = i % 2 == 0 ? [i * 5, 0] : [0, i * 5]
            ctx.lineTo(...args)
        }
        ctx.stroke()
    }

    showCanvases() {
        document.body.append(this.canvases.light.context.canvas)
        document.body.append(this.canvases.shadow.context.canvas)
    }

    static makeTexCanvas(fillColor?: string) {
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
uniform vec3 lightPosition;

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
uniform float ambientStrength;
uniform sampler2D myTexture;

// Inputs
in vec3 vertexNormal;
// in vec4 vertexColor;
in vec3 vertexPosition;

// Outputs
// gl_FragColor

// constants
const vec2 LIGHT_COORD = vec2(0, 0);
const vec2 SHADE_COORD = vec2(1, 0);

// Function declarations
vec4 lakesIlluminatedDiffuseColor();
vec4 lakesShadowedDiffuseColor();
vec4 lakesShading(vec3 normal, vec3 lightPosition);

// Entry
void main() {
    vec4 illuminatedColor = texture2D(myTexture, LIGHT_COORD);
    vec4 shadedColor = texture2D(myTexture, SHADE_COORD);

    vec3 normal = normalize(vertexNormal); // n_bar
    vec3 lightDirection = normalize(lightPosition - vertexPosition); // l_bar
    float cosAngIncidence = max(
        dot(normal, lightDirection), 0.0
    );

    vec3 diffuse;
    if (cosAngIncidence > 0.5) {
        // light
        diffuse = vec3(illuminatedColor);
    } else {
        // shade
        diffuse = vec3(shadedColor);
    }

    gl_FragColor = vec4(diffuse, 1.0f);
}

vec4 lakesShading(vec3 normal, vec3 lightPosition) {
    vec4 illuminatedDiffuseColor = vec4(0.0f);
    vec4 shadowedDiffuseColor = vec4(0.0f);
    return vec4(0.0f);
}
`
