import {
    TorusGeometry,
    TorusKnotGeometry,
} from "three"

import { gui } from "./gui"

export const ShapeOptions = ['donut', 'torus'] as const
export type SupportedShapes = typeof ShapeOptions[number]

const donut = new TorusGeometry(900, 300, 160, 100)
const torusKnot = new TorusKnotGeometry(900, 300, 150, 18)

export class ShapesSelector {
    static get geometry(): TorusGeometry | TorusKnotGeometry {
        // Saved references to geometries
        const geometry = {
            donut: donut,
            torus: torusKnot,
        }[gui.geometry]
        return geometry
    }
}
