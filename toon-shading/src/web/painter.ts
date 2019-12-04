import { Color } from "three/src/math/Color"
import { CanvasTexture } from "three/src/textures/CanvasTexture"
import { DataTexture } from "three/src/textures/DataTexture"
import { RGBFormat, UnsignedByteType } from "three/src/constants"
import { Vector3 } from "three/src/math/Vector3"
import { Texture } from "three/src/textures/Texture"
import { gui } from "./gui"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import { calculateLakeColors, LakeColors, selectStandardSubstanceLighting, SubstanceLighting } from "./lakes"
import { normalize } from "./utils"
import { Material } from "three"

interface CanvasTexturePair {
    context: CanvasRenderingContext2D
    texture: CanvasTexture
}

interface PainterUniforms {
    lightPosition: { value: Vector3 }
    lakesTextures: { value: Texture[] }
    textureCount: { value: number }
    [uniform: string]: { value: any }
}

export class Painter extends ShaderMaterial {
    name = 'painter'

    private illuminationLayers: CanvasTexturePair[] = []
    private _color: string = 'rbg(125, 105, 125)'
    private static dimension = 512

    public customColors?: SubstanceLighting = undefined

    private textures: Texture[] = []

    get color() {
        return new Color(this._color)
    }

    set color(value) {
        this._color = value.getStyle()
    }

    updateUniforms(): PainterUniforms {
        this.needsUpdate = true
            ; (this as any).uniformsNeedUpdate = true
        if (gui.hasChanged) {
            this.textures = []
            let substanceLight = selectStandardSubstanceLighting[gui.substance]
            let environmentLight = {
                ambientGlobal: new Vector3(...new Color(gui.ambientGlobal).toArray()),
                ambientLight: new Vector3(...new Color(gui.ambientLight).toArray()),
                diffuseLight: new Vector3(...new Color(gui.diffuseLight).toArray()),
            }
            if (gui.useColor) {
                substanceLight = {
                    ambientMaterial: new Vector3(...new Color(gui.ambientMaterial).toArray().map(v => v * 255)),
                    diffuseMaterial: new Vector3(...new Color(gui.diffuseMaterial).toArray().map(v => v * 255)),
                }
            }
            if (this.customColors) {
                substanceLight = this.customColors
            }
            const lakeColors = calculateLakeColors(substanceLight, environmentLight)
            switch (gui.material) {
                // Tonal shader selected
                case 'toon':
                    this.textures.push(this.toon(lakeColors))
                    break
                // Scribble shader selected
                case 'scribble':
                    this.color = new Color(...normalize(lakeColors.illuminated, 255))
                    this.textures.push(...this.scribble(+gui.levels))
                    if (gui.showCanvases) {
                        this.showCanvases()
                    } else {
                        this.removeCanvases()
                    }
                    break
            }
        }
        return {
            lightPosition: { value: new Vector3(...gui.lightPosition) },
            lakesTextures: { value: this.textures },
            textureCount: { value: this.textures.length },
        }
    }

    beforeRender = ({ }, { }, { }, { }, material: Material) => {
        if (material instanceof Painter) {
            Object.assign(material.uniforms, this.updateUniforms())
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

    removeCanvases() {
        for (let i = 0; i < 4; i++) {
            const id = `level-${i}`
            const canvas = document.getElementById(id)
            const label = document.getElementById(`level-${i}-label`)
            if (canvas) canvas.remove()
            if (label) label.remove()
        }
    }

    showCanvases() {
        this.removeCanvases()
        const layersSection = document.getElementById('layers')!
        for (let i = 0; i < this.illuminationLayers.length; i++) {
            const layer = this.illuminationLayers[i]

            const label = document.createElement('label')
            label.innerText = `Shading Level ${i}:`
            label.id = `level-${i}-label`

            layer.context.canvas.id = `level-${i}`
            layer.context.canvas.setAttribute('title', `Level ${i}`)
            layersSection.append(label, layer.context.canvas)
        }
    }

    private zigzag(level: number, ctx: CanvasRenderingContext2D, color: string) {
        ctx.save()
        ctx.lineCap = 'round'
        ctx.fillStyle = ctx.strokeStyle = color
        ctx.beginPath()
        ctx.moveTo(0, 0)
        for (let i = 1; i < Painter.dimension / 2; i += 1) {
            ctx.lineWidth = Math.random() * 2.3 + level + 1
            // const start = (i - 1) % 2 == 0 ? [Math.abs((i - 1) * 5), 0] : [0, Math.abs((i - 1) * 5)]
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

    vertexShader = `
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

    fragmentShader = `
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
