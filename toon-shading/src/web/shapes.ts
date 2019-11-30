import { TorusGeometry } from "three/src/geometries/TorusGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { gui } from "./gui"

export const ShapeOptions = ['donut', 'torus'] as const
export type SupportedShapes = typeof ShapeOptions[number]

export class ShapesSelector {
    public donut = new TorusGeometry(900, 300, 160, 100)
    public torusKnot = new TorusKnotGeometry(900, 300, 150, 18)

    get geometry() {
        // Saved references to geometries
        return {
            donut: this.donut,
            torus: this.torusKnot,
        }[gui.geometry]
    }
}
