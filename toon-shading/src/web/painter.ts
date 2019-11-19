import { Color } from "three/src/math/Color"
import { CanvasTexture } from "three/src/textures/CanvasTexture"

interface CanvasTexturePair {
    context: CanvasRenderingContext2D
    texture: CanvasTexture
}

export class Painter {
    illuminationLayers: CanvasTexturePair[]
    private _color: string
    constructor(
        color?: Color,
        public levels: 2 | 3 | 4 = 2
    ) {
        this._color = (color || new Color(1.0, 1.0, 1.0)).getStyle()
        this.illuminationLayers = [
            Painter.makeTexCanvas(this.color.getStyle()),
            Painter.makeTexCanvas(this.color.sub(new Color(0.2, 0.2, 0.2)).getStyle()),
        ]
        if (levels >= 3) {
            this.illuminationLayers.push(
                Painter.makeTexCanvas(this.color.sub(new Color(0.3, 0.3, 0.3)).getStyle())
            )
        }
        if (levels >= 4) {
            this.illuminationLayers.push(
                Painter.makeTexCanvas(this.color.sub(new Color(0.4, 0.4, 0.4)).getStyle())
            )
        }
    }

    get color() {
        return new Color(this._color)
    }

    /**
     * Scribbles procedurally on a canvas to create artistic effect
     */
    scribble() {
        for (let level = 0; level < this.illuminationLayers.length; level++) {
            const ctx = this.illuminationLayers[level].context

            ctx.strokeStyle = this.color.getStyle()
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

    static makeTexCanvas(fillColor: string): CanvasTexturePair {
        let canvas = document.createElement('canvas')
        canvas.height = 256
        canvas.width = 256
        let context = canvas.getContext('2d')!
        context.fillStyle = fillColor
        context.fillRect(0, 0, 256, 256)
        let texture = new CanvasTexture(canvas)
        return { context, texture }
    }

}

export const vertexShader = `
out vec3 vertexNormal;
out vec3 vertexPosition;
out vec2 vertexUV;

void main() {
    vertexNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
    vertexPosition = vec3(modelMatrix * vec4(position, 1.0));
    vertexUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const fragmentShader = `
// Defines
#define MAX_SHADING_LEVELS 4
#define ERROR_COLOR vec3(0.5, 0.4, 0.5)

// Uniforms
uniform vec3 lightPosition;
uniform sampler2D lakesTexture[4];
uniform int textureCount;

// Inputs
in vec3 vertexNormal;
in vec3 vertexPosition;
in vec2 vertexUV;

// Outputs
// gl_FragColor

// Constants
const vec2 ILLUM_COORD = vec2(0, 0);
const vec2 SHADE_COORD = vec2(1, 0);

// Functions

vec3 lakesTonalShading(float cos) {
    if (cos > 0.5) {
        // illuminated
        return vec3(texture2D(lakesTexture[0], ILLUM_COORD));
    } else {
        // shaded
        return vec3(texture2D(lakesTexture[0], SHADE_COORD));
    }
}

int getShadingLevel(float cos, float increment) {
    float range = 0.0;
    for (int i = 0; i < MAX_SHADING_LEVELS && range < 1.01; i++, range += increment) {
        if (cos >= range && cos < range + increment) {
            return (MAX_SHADING_LEVELS - i) - 1;
        }
    }
    return -1;
}

vec3 lakesScribbleShading(float cos) {
    float rangeIncrement = 1.0 / float(textureCount);
    int level = getShadingLevel(cos, rangeIncrement);
    switch (level) {
        case 0: return vec3(texture2D(lakesTexture[0], vertexUV));
        case 1: return vec3(texture2D(lakesTexture[1], vertexUV));
        case 2: return vec3(texture2D(lakesTexture[2], vertexUV));
        case 3: return vec3(texture2D(lakesTexture[3], vertexUV));
        case -1: return ERROR_COLOR;
    }
}

// Entry
void main() {
    vec3 colorToShadeIn;

    vec3 normal = normalize(vertexNormal); // n_bar
    vec3 lightDirection = normalize(lightPosition - vertexPosition); // l_bar

    float cos = clamp(dot(normal, lightDirection), 0.0, 1.0);

    if(textureCount == 1) {
        // Basic 2 Tone Shading
        colorToShadeIn = lakesTonalShading(cos);
    } else {
        // Scribble texture pack
        colorToShadeIn = lakesScribbleShading(cos);
    }
    gl_FragColor = vec4(colorToShadeIn, 1.0);
}
`
