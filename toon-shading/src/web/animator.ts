import { Vector3 } from "three/src/math/Vector3"
import { Geometry } from "three/src/core/Geometry"
import { Mesh } from "three/src/objects/Mesh"

import { gui } from "./gui"

export class Animator {
    private _geometries: Geometry[] = []
    private state = {
        lastVelocityX: 0,
        lastVelocityY: 0,
        lastLineCount: 1,
        lastFlipDirection: !gui.flipDirection
    }

    get lines() { return this._geometries }

    makeLineGeometries(mesh: Mesh) {
        let currentShapeVertices = (mesh.geometry as Geometry).vertices.slice(0)
        const axisSort = this.selectBestAxis()
        currentShapeVertices.sort(
            (a, b) => gui.flipDirection ? a[axisSort] - b[axisSort] : b[axisSort] - a[axisSort]
        )
        currentShapeVertices = currentShapeVertices.slice(0, gui.lineCount * 2)

        let randomVertices = []
        for (let i = 0; i < gui.lineCount; i++) {
            const v = currentShapeVertices[Math.floor(Math.random() * currentShapeVertices.length)]
            randomVertices.push(v)
        }

        for (let i = 0; i < randomVertices.length; i++) {
            let geo
            if (i < this._geometries.length) {
                geo = this._geometries[i]
                geo.vertices.length = 0 // clear vertices
            } else {
                geo = new Geometry()
            }
            geo.name = `line_${i}`
            const start = randomVertices[i]
            const end = new Vector3(
                start.x - gui.velocityX,
                start.y - gui.velocityY,
                start.z,
            )
            geo.vertices.push(start, end)
            this._geometries.push(geo)
        }
        return this._geometries
    }

    selectBestAxis() {
        if (gui.velocityX >= gui.velocityY) {
            return 'x'
        } else {
            return 'y'
        }
    }

    velocityChange() {
        const result = this.state.lastVelocityX !== gui.velocityX
            || this.state.lastVelocityY !== gui.velocityY
            || this.state.lastLineCount !== gui.lineCount
            || this.state.lastFlipDirection !== gui.flipDirection
        this.state.lastVelocityX = gui.velocityX
        this.state.lastVelocityY = gui.velocityY
        this.state.lastLineCount = gui.lineCount
        this.state.lastFlipDirection = gui.flipDirection
        return result
    }
}
