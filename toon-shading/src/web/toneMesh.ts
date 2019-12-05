import { Group } from "three/src/objects/Group"
import { Mesh } from "three/src/objects/Mesh"

import { Painter } from "./painter"
import { Inker } from "./inker"
import { ShapesSelector } from "./shapes"
import { Animator } from "./animator"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { Line } from "three/src/objects/Line"
import { Object3D } from "three/src/core/Object3D"
import { Geometry } from "three/src/core/Geometry"

const painter = new Painter()
const inker = new Inker()
export class TonalObject3D extends Group {
    // private animator: Animator
    // private lines: Line[] = []

    constructor() {
        super()
        // this.animator = new Animator()

        this.addGeometries(ShapesSelector.geometry)
    }

    addGeometries(...geometries: Geometry[]) {
        let all: Object3D[] = geometries.flatMap(geometry => {
            const object = new Mesh(geometry, painter)
            const shadow = new Mesh(geometry, inker)
            // this.lines = this.animator.lines.map(l => {
            //     const line = new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
            //     line.onBeforeRender = this.beforeRenderLine
            //     return line
            // })
            object.onBeforeRender = painter.beforeRender
            shadow.onBeforeRender = inker.beforeRender
            return [object, shadow]
        })
        return super.add(...all)
    }

    // beforeRenderLine = () => {
    //     if (this.animator.velocityChange()) {
    //         const lines = this.animator.lines
    //         this.remove(...this.lines)
    //         this.lines = lines.map(l => {
    //             const line = new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
    //             line.onBeforeRender = this.beforeRenderLine
    //             return line
    //         })
    //         this.add(...this.lines)
    //     }
    // }
}
