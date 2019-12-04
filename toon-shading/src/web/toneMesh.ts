import { Group } from "three/src/objects/Group"
import { Mesh } from "three/src/objects/Mesh"
import { Material } from "three/src/materials/Material"

import { Painter } from "./painter"
import { Inker } from "./inker"
import { ShapesSelector } from "./shapes"
import { Animator } from "./animator"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { Line } from "three/src/objects/Line"
import { Geometry, BufferGeometry } from "three"

export class ToneShadowMesh extends Group {
    private painter: Painter
    private inker: Inker
    private animator: Animator

    public object: Mesh
    public shadow: Mesh
    public lines: Line[]

    constructor() {
        super()
        this.painter = new Painter()
        this.inker = new Inker()
        this.animator = new Animator()

        this.object = new Mesh(ShapesSelector.geometry, this.painter.material)
        this.shadow = new Mesh(ShapesSelector.geometry, this.inker.material)
        this.lines = this.animator.lineGeometries.map(l =>
            new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
        )

        this.object.onBeforeRender = this.beforeRenderObject
        this.shadow.onBeforeRender = this.beforeRenderShadow
        this.lines.forEach(l => l.onBeforeRender = this.beforeRenderLine)

        this.add(this.object, this.shadow, ...this.lines)
    }

    beforeRenderObject = () => {
        // Every time this specific shadow is drawn we will update the uniforms to create the drawing
        // implicitly runs updates
        this.object.material = this.painter.material
        this.object.material.needsUpdate = true
        this.object.geometry = ShapesSelector.geometry // mostly a noop
    }

    beforeRenderShadow = () => {
        this.shadow.material = this.inker.material
        this.shadow.material.needsUpdate = true
        this.shadow.geometry = ShapesSelector.geometry
    }

    beforeRenderLine = () => {
        if (this.animator.velocityChange()) {
            const lines = this.animator.lineGeometries
            this.remove(...this.lines)
            this.lines = lines.map(l => {
                const line = new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
                line.onBeforeRender = this.beforeRenderLine
                return line
            })
            this.add(...this.lines)
        }
    }
}
