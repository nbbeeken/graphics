import { CanvasTexture } from "three"

export class Painter {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    texture: CanvasTexture
    constructor() {
        this.canvas = document.createElement('canvas')
        this.canvas.height = 256
        this.canvas.width = 256
        this.context = this.canvas.getContext('2d')!

        this.context.fillStyle = '#FF0000'
        this.context.fillRect(0, 0, 256, 256)

        this.texture = new CanvasTexture(this.canvas)
    }
}

export const vertexShader = `
out vec3 vertexNormal;
out vec3 vertexPosition;

void main() {
    vertexNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
    vertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
`

export const fragmentShader = `
// Uniforms
uniform vec2 resolution;
uniform float time;
uniform vec3 lightColor;
uniform vec3 lightPosition;
uniform float ambientStrength;

// Inputs
in vec3 vertexNormal;
// in vec4 vertexColor;
in vec3 vertexPosition;

// Outputs
// gl_FragColor

// constants

// Function declarations
vec4 lakesIlluminatedDiffuseColor();
vec4 lakesShadowedDiffuseColor();
vec4 lakesShading(vec3 normal, vec3 lightPosition);

// Entry
void main() {
    vec3 ambient = vec3(ambientStrength * lightColor);

    vec3 normal = normalize(vertexNormal);
    vec3 lightDirection = normalize(lightPosition - vertexPosition);
    float diffusion = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = diffusion * lightColor;

    gl_FragColor = vec4((ambient + diffuse) * vec3(0.5f, 0.5f, 0.5f), 1.0f);
}

vec4 lakesShading(vec3 normal, vec3 lightPosition) {
    vec4 illuminatedDiffuseColor = vec4(0.0f);
    vec4 shadowedDiffuseColor = vec4(0.0f);
    return vec4(0.0f);
}
`
