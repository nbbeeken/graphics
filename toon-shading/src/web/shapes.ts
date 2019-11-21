import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { CylinderGeometry } from "three/src/geometries/CylinderGeometry"
import { TorusKnotGeometry } from "three/src/geometries/TorusKnotGeometry"
import { gui } from "./gui"

export class ShapesSelector {
    public box = new BoxGeometry(...[1, 1])
    public cone = new ConeGeometry(...[1, 1, 32])
    public cylinder = new CylinderGeometry(...[1, 1, 1, 32])
    public torus = new TorusKnotGeometry(...[1, 0.3])

    get geometry() {
        // Saved references to geometries
        return {
            box: this.box,
            cone: this.cone,
            cylinder: this.cylinder,
            torus: this.torus,
        }[gui.geometry]
    }
}
