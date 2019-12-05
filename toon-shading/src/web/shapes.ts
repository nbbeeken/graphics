import { TorusGeometry } from "three/src/geometries/TorusGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { Geometry } from "three/src/core/Geometry"

import { gui } from "./gui"

export const ShapeOptions = ['donut', 'torus'] as const
export type SupportedShapes = typeof ShapeOptions[number]

const donut = new TorusGeometry(900, 300, 160, 100)
const torusKnot = new TorusKnotGeometry(900, 300, 150, 18)

export class ShapesSelector {
    constructor() { }

    static get geometry(): Geometry {
        // Saved references to geometries
        const geometry = {
            donut: donut,
            torus: torusKnot,
        }[gui.geometry]
        return geometry
    }


}
