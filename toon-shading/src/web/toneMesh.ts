import { Group } from "three/src/objects/Group"
import { Mesh } from "three/src/objects/Mesh"
import { Material } from "three/src/materials/Material"

import { Painter } from "./painter"
import { Inker } from "./inker"
import { ShapesSelector } from "./shapes"

export class ToneShadowMesh extends Group {
    private painter: Painter
    private inker: Inker
    private shapesSelector: ShapesSelector

    public object: Mesh
    public shadow: Mesh

    constructor() {
        super()
        this.painter = new Painter()
        this.inker = new Inker()
        this.shapesSelector = new ShapesSelector()

        this.object = new Mesh(this.shapesSelector.geometry, this.painter.material)
        this.shadow = new Mesh(this.shapesSelector.geometry, this.inker.material)

        this.object.onBeforeRender = this.beforeRender
        this.shadow.onBeforeRender = this.beforeRender

        this.add(this.object, this.shadow)
    }

    beforeRender = ({ }, { }, { }, { }, material: Material) => {
        // Every time this specific shadow is drawn we will update the uniforms to create the drawing
        // implicitly runs updates
        if (material.name === 'inker') {
            this.shadow.material = this.inker.material
            this.shadow.material.needsUpdate = true
        }
        if (material.name === 'painter') {
            this.object.material = this.painter.material
            this.object.material.needsUpdate = true
        }
        this.shadow.geometry = this.shapesSelector.geometry // mostly a noop
        this.object.geometry = this.shapesSelector.geometry // mostly a noop
    }
}
