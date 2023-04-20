import { Vector3 } from "three"
import { BufferGeometry } from "three"

import { gui } from "./gui"
import { ShapesSelector } from "./shapes"

export class Animator {
    private state = {
        lastVelocityX: 0,
        lastVelocityY: 0,
        lastLineCount: 1,
        lastFlipDirection: !gui.flipDirection
    }

    newLine(vertex: Vector3, name?: number) {
        let geo = new BufferGeometry()
        geo.name = `line_${name}`
        const start = vertex
        const end = new Vector3(
            start.x - gui.velocityX,
            start.y - gui.velocityY,
            start.z,
        )
        geo.vertices.push(start, end)
        geo.verticesNeedUpdate = true
        return geo
    }

    randomVertices(count: number) {
        let currentShapeVertices = ShapesSelector.geometry.vertices.slice(0)
        const axisSort = this.selectBestAxis()
        currentShapeVertices.sort(
            (a, b) => gui.flipDirection ? a[axisSort] - b[axisSort] : b[axisSort] - a[axisSort]
        )
        currentShapeVertices = currentShapeVertices.slice(0, count * 2)

        let randomVertices: Vector3[] = []
        for (let i = 0; i < count; i++) {
            const v = currentShapeVertices[Math.floor(Math.random() * currentShapeVertices.length)]
            randomVertices.push(v)
        }
        return randomVertices
    }

    makeLineGeometries() {
        let randomVertices: Vector3[] = this.randomVertices(gui.lineCount)
        const lines = []
        for (let i = 0; i < randomVertices.length; i++) {
            const geo = this.newLine(randomVertices[i])
            lines.push(geo)
        }
        return lines
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

    beforeRender = ({ }, { }, { }, geometry: BufferGeometry, { }) => {
        if (!this.velocityChange()) {
            return
        }
        const g = geometry as BufferGeometry
        const vertices = g.attributes.position.array as Array<number>
        const start = new Vector3(vertices[0], vertices[1], vertices[2])
        const end = new Vector3(
            start.x - gui.velocityX,
            start.y - gui.velocityY,
            start.z,
        )
        vertices[3] = end.x
        vertices[4] = end.y
        //@ts-ignore
        g.attributes.position.needsUpdate = true
    }
}
