import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { TorusGeometry } from "three/src/geometries/TorusGeometry"
import { CylinderGeometry } from "three/src/geometries/CylinderGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { gui } from "./gui"

export class ShapesSelector {
    public box = new BoxGeometry(...[1, 1])
    public torus = new TorusGeometry(...[1, 0.3, 16, 100])
    public cylinder = new CylinderGeometry(...[1, 1, 1, 32])
    public torusKnot = new TorusKnotGeometry(...[1, 0.3, 150, 18])

    get geometry() {
        // Saved references to geometries
        return {
            box: this.box,
            donut: this.torus,
            cylinder: this.cylinder,
            torus: this.torusKnot,
        }[gui.geometry]
    }
}
