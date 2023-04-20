import {
    Group,
    Mesh,
    LineBasicMaterial,
    Line,
    Object3D,
} from "three"

import { Painter } from "./painter"
import { Inker } from "./inker"
import { ShapesSelector } from "./shapes"
import { Animator } from "./animator"

const painter = new Painter()
const inker = new Inker()
const animator = new Animator()
let lineGroups: string[] = []

export class TonalObject3D extends Group {
    constructor() {
        super()
        this.addGeometries(ShapesSelector.geometry)
    }
    addGeometries(...geometries: any[]) {
        let all: Object3D[] = geometries.flatMap(geometry => {
            const object = new Mesh(geometry, painter)
            const shadow = new Mesh(geometry, inker)
            object.onBeforeRender = painter.beforeRender
            shadow.onBeforeRender = inker.beforeRender
            return [object, shadow]
        })
        return super.add(...all)
    }

    addLines() {
        const lines = new Group()
        lines.name = 'lines'
        lines.add(...animator.makeLineGeometries().map(l => {
            const line = new Line(l, new LineBasicMaterial({ color: 0x00_00_00 }))
            line.onBeforeRender = animator.beforeRender
            return line
        }))
        lineGroups.push(lines.uuid)
        super.add(lines)
    }

    removeLines(root: Object3D) {
        for (const lineUUID of lineGroups) {
            root.getObjectByProperty('uuid', lineUUID)?.traverse(child => {
                if (child instanceof Group) {
                    let lines: Line[] = child.children.filter(l => l instanceof Line) as Line[]
                    for (const line of lines) {
                        line.geometry.dispose()
                        if (line.material instanceof LineBasicMaterial) {
                            line.material.dispose()
                        }
                    }
                    child.remove(...lines)
                    root.remove(child)
                }
            })
        }
    }
}
