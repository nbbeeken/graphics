import { TorusGeometry } from "three/src/geometries/TorusGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { gui } from "./gui"

export const ShapeOptions = ['donut', 'torus'] as const
export type SupportedShapes = typeof ShapeOptions[number]

const donut = new TorusGeometry(900, 300, 160, 100)
const torusKnot = new TorusKnotGeometry(900, 300, 150, 18)
export class ShapesSelector {
    static get geometry() {
        // Saved references to geometries
        return {
            donut: donut,
            torus: torusKnot,
        }[gui.geometry]
    }
}
