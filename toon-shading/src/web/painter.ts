import { Color } from "three/src/math/Color"
import { CanvasTexture } from "three/src/textures/CanvasTexture"
import { DataTexture } from "three/src/textures/DataTexture"
import { RGBFormat, UnsignedByteType } from "three/src/constants"
import { Vector3 } from "three/src/math/Vector3"
import { Texture } from "three/src/textures/Texture"
import { gui } from "./gui"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { calculateLakeColors, selectStandardMaterialLighting, LakeColors } from "./lakes"
import { normalize } from "./utils"

interface CanvasTexturePair {
    context: CanvasRenderingContext2D
    texture: CanvasTexture
}

let canvasesShown: boolean = false

interface PainterUniforms {
    lightPosition: { value: Vector3 }
    lakesTextures: { value: Texture[] }
    textureCount: { value: number }
    [uniform: string]: { value: any }
}

export class Painter {
    private illuminationLayers: CanvasTexturePair[] = []
    private _color: string = 'rbg(125, 105, 125)'
    private static dimension = 512

    private textures: Texture[] = []


    get color() {
        return new Color(this._color)
    }

    set color(value) {
        this._color = value.getStyle()
    }

    get material() {
        // Run updates on fetch
        return new ShaderMaterial({
            name: `lake${gui.material}Shader`,
            fragmentShader: Painter.fragmentShader,
            vertexShader: Painter.vertexShader,
            uniforms: this.uniforms
        })
    }

    get uniforms(): PainterUniforms {
        if (gui.hasChanged) {
            this.textures = []
            const materialLight = selectStandardMaterialLighting[gui.color]
            const lakeColors = calculateLakeColors(materialLight)
            switch (gui.material) {
                // Tonal shader selected
                case 'toon':
                    this.textures.push(this.toon(lakeColors))
                    break
                // Scribble shader selected
                case 'scribble':
                    this.color = new Color(...normalize(lakeColors.illuminated, 255))
                    this.textures.push(...this.scribble(gui.levels))
                    this.showCanvases()
                    break
            }
        }
        return {
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            lakesTextures: { value: this.textures },
            textureCount: { value: this.textures.length },
        }
    }

    toon(lakeColors: LakeColors) {
        return new DataTexture(new Uint8Array([
            ...lakeColors.illuminated,
            ...lakeColors.shadowed,
        ]), 2, 1, RGBFormat, UnsignedByteType)
    }

    /**
     * Scribbles procedurally on a canvas to create artistic effect
     */
    scribble(levels: number) {
        this.illuminationLayers = (new Array(levels)).fill(null).map(_ => this.makeTexCanvas())

        for (let level = 0; level < this.illuminationLayers.length; level++) {
            const ctx = this.illuminationLayers[level].context
            const subtractAmount = [0.1, 0.1, 0.1].map(cv => cv * (level + 1))
            const color = this.color.sub(new Color(...subtractAmount)).getStyle()
            this.zigzag(level, ctx, color)
            this.pointillism(level, ctx, color)
        }
        return this.illuminationLayers.map(v => v.texture)
    }

    showCanvases() {
        if (!canvasesShown) {
            canvasesShown = true
            for (let i = 0; i < this.illuminationLayers.length; i++) {
                const layer = this.illuminationLayers[i]

                layer.context.canvas.setAttribute('title', `Level ${i}`)
                document.body.append(layer.context.canvas)
            }
        }
    }

    private zigzag(level: number, ctx: CanvasRenderingContext2D, color: string) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.fillStyle = ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(0, 0)
        for (let i = 1; i < Painter.dimension / 2; i += 1) {
            ctx.lineWidth = Math.random() * 3 + level + 1
            const start = (i - 1) % 2 == 0 ? [Math.abs((i - 1) * 5), 0] : [0, Math.abs((i - 1) * 5)]
            const [x, y] = i % 2 == 0 ? [i * 5, 0] : [0, i * 5]
            // randomize line width along its path
            // for (let [linePosX, linePosY] = start; linePosX > x && linePosY > y; linePosX += 1, linePosY += 1) {
            //     ctx.lineWidth = Math.random() * 3 + level + 1
            //     ctx.lineTo(linePosX, linePosY)
            //     ctx.stroke()
            // }
            ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.restore()
    }

    private pointillism(level: number, ctx: CanvasRenderingContext2D, color: string) {
        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = color
        const radius = Math.random() * 5 + 10
        // const offset = () => (radius + 2 * ((this.illuminationLayers.length - level) + 1))
        const offset = () => radius - Math.random() * 3
        for (let x = 0; x < Painter.dimension; x += offset()) {
            for (let y = 0; y < Painter.dimension; y += offset()) {
                ctx.lineWidth = 1 //Math.random() * 3 + level + 1
                ctx.beginPath()
                ctx.arc(x, y, radius, 0, 2 * Math.PI)
                ctx.stroke()
                // ctx.fill()
            }
        }
        ctx.restore()
    }

    private makeTexCanvas(): CanvasTexturePair {
        let canvas = document.createElement('canvas')
        canvas.height = Painter.dimension
        canvas.width = Painter.dimension
        let context = canvas.getContext('2d')!
        context.fillStyle = this.color.getStyle() //new Color(Math.random(), Math.random(), Math.random()).getStyle()
        context.fillRect(0, 0, Painter.dimension, Painter.dimension)
        let texture = new CanvasTexture(canvas)
        return { context, texture }
    }

    static vertexShader = `
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

    static fragmentShader = `
        // Defines
        #define MAX_SHADING_LEVELS 4
        #define ERROR_COLOR vec3(0.5, 0.4, 0.5)

        // Uniforms
        uniform vec3 lightPosition;
        uniform sampler2D lakesTextures[4];
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
                return vec3(texture2D(lakesTextures[0], ILLUM_COORD));
            } else {
                // shaded
                return vec3(texture2D(lakesTextures[0], SHADE_COORD));
            }
        }

        int getShadingLevel(float cos, float increment) {
            float range = 0.0;
            for (int i = 0; i < MAX_SHADING_LEVELS && range < 1.01; i++, range += increment) {
                if (cos >= range && cos < range + increment) {
                    return (textureCount - i) - 1;
                }
            }
            return -1;
        }

        vec3 lakesScribbleShading(float cos) {
            float rangeIncrement = 1.0 / float(textureCount);
            int level = getShadingLevel(cos, rangeIncrement);
            switch (level) {
                case 0: return vec3(texture2D(lakesTextures[0], vertexUV));
                case 1: return vec3(texture2D(lakesTextures[1], vertexUV));
                case 2: return vec3(texture2D(lakesTextures[2], vertexUV));
                case 3: return vec3(texture2D(lakesTextures[3], vertexUV));
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
}
