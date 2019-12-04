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
import { Object3D } from "three"

export class ToneShadowMesh extends Group {
    private painter: Painter
    private inker: Inker
    private animator: Animator
    private lines: Line[] = []

    constructor() {
        super()
        this.painter = new Painter()
        this.inker = new Inker()
        this.animator = new Animator()

        this.addGeometries(ShapesSelector.geometry)
    }

    addGeometries(...geometries: Geometry[]) {
        let all: Object3D[] = geometries.flatMap(geometry => {
            const object = new Mesh(geometry, this.painter)
            const shadow = new Mesh(geometry, this.inker)
            this.lines = this.animator.lines.map(l => {
                const line = new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
                line.onBeforeRender = this.beforeRenderLine
                return line
            })
            object.onBeforeRender = this.painter.beforeRender
            shadow.onBeforeRender = this.inker.beforeRender
            return [object, shadow]
        })
        return super.add(...all)
    }

    beforeRenderLine = () => {
        if (this.animator.velocityChange()) {
            const lines = this.animator.lines
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
