import { Group } from "three/src/objects/Group"
import { Mesh } from "three/src/objects/Mesh"
import { Material } from "three/src/materials/Material"

import { Painter } from "./painter"
import { Inker } from "./inker"
import { ShapesSelector } from "./shapes"
import { Object3D, Geometry } from "three"

export class ToneShadowMesh extends Group {
    private painter: Painter
    private inker: Inker
    private shapesSelector: ShapesSelector


    constructor() {
        super()
        this.painter = new Painter()
        this.inker = new Inker()
        this.shapesSelector = new ShapesSelector()

        this.addGeometries(this.shapesSelector.geometry)
    }

    addGeometries(...geometries: Geometry[]) {
        let all: Object3D[] = geometries.flatMap(geometry => {
            const object = new Mesh(geometry, this.painter)
            const shadow = new Mesh(geometry, this.inker)
            object.onBeforeRender = this.painter.beforeRender
            shadow.onBeforeRender = this.inker.beforeRender
            return [object, shadow]
        })
        return super.add(...all)
    }
}
