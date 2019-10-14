import * as dat from "dat.gui"

export class GUIControls {
    constructor(
        // Translating
        public translationX: number = 45,
        public translationY: number = 150,
        public translationZ: number = 0,
        // Scaling
        public scaleX: number = 1,
        public scaleY: number = 1,
        public scaleZ: number = 1,
        // Rotating
        public rotationX: number = 40,
        public rotationY: number = 25,
        public rotationZ: number = 325,
        public colorVec: [number, number, number] = [29, 116, 178],
        public colorAlpha: number = 1.0,
    ) { }

    get translation(): [number, number, number] {
        return [this.translationX, this.translationY, this.translationZ]
    }
    get scaling(): [number, number, number] {
        return [this.scaleX, this.scaleY, this.scaleZ]
    }
    get rotation() {
        return { x: this.rotationX, y: this.rotationY, z: this.rotationZ }
    }
    get color(): [number, number, number, number] {
        return [...this.colorVec.slice(0, 3).map(v => v / 255), this.colorAlpha]
    }
}

export function initGui(guiControls: GUIControls) {
    const gui = new dat.GUI()

    const translationFolder = gui.addFolder('translation')
    translationFolder.add(guiControls, 'translationX', 0, 1000)
    translationFolder.add(guiControls, 'translationY', 0, 1000)
    translationFolder.add(guiControls, 'translationZ', 0, 1000)

    const scaleFolder = gui.addFolder('scale')
    scaleFolder.add(guiControls, 'scaleX', -5, 5)
    scaleFolder.add(guiControls, 'scaleY', -5, 5)
    scaleFolder.add(guiControls, 'scaleZ', -5, 5)

    const rotationFolder = gui.addFolder('rotation')
    rotationFolder.add(guiControls, 'rotationX', 0, 360)
    rotationFolder.add(guiControls, 'rotationY', 0, 360)
    rotationFolder.add(guiControls, 'rotationZ', 0, 360)

    const colorFolder = gui.addFolder('color')
    colorFolder.addColor(guiControls, 'colorVec')
    colorFolder.add(guiControls, 'colorAlpha', 0, 1, 0.01)
}
