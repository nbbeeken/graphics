import { TorusGeometry } from "three/src/geometries/TorusGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { Geometry } from "three/src/core/Geometry"

import { gui } from "./gui"

export const ShapeOptions = ['donut', 'torus', 'performance'] as const
export type SupportedShapes = typeof ShapeOptions[number]

export class ShapesSelector {

    public donut = new TorusGeometry(900, 300, 160, 100)
    public torusKnot = new TorusKnotGeometry(900, 300, 150, 18)

    constructor(public complex?: any) { }

    get geometry(): Geometry {
        // Saved references to geometries
        return {
            donut: this.donut,
            torus: this.torusKnot,
            performance: this.complex
        }[gui.geometry]
    }


}
