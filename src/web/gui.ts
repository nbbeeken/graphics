import * as dat from "dat.gui"

export class GUIControls {
    constructor(
        // Translating
        public translationX: number = 145,
        public translationY: number = 150,
        public translationZ: number = 0,
        // Scaling
        public scaleX: number = 1,
        public scaleY: number = 1,
        public scaleZ: number = 1,
        // Rotating
        public rotationX: number = 0,
        public rotationY: number = 0,
        public rotationZ: number = 0,
        public colorVec: [number, number, number] = [35, 200, 0],
        public colorAlpha: number = 1.0,

        public animate: boolean = false,
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
        return [...this.colorVec.slice(0, 3).map(v => v / 255), this.colorAlpha] as [number, number, number, number]
    }
}

export function initGui(guiControls: GUIControls) {
    const gui = new dat.GUI()

    gui.add(guiControls, 'animate')

    const translationFolder = gui.addFolder('translation')
    translationFolder.add(guiControls, 'translationX', 0, 1000)
    translationFolder.add(guiControls, 'translationY', 0, 1000)
    translationFolder.add(guiControls, 'translationZ', 0, 1000)

    const scaleFolder = gui.addFolder('scale')
    scaleFolder.add(guiControls, 'scaleX', -5, 5)
    scaleFolder.add(guiControls, 'scaleY', -5, 5)
    scaleFolder.add(guiControls, 'scaleZ', -5, 5)

    const rotationFolder = gui.addFolder('rotation')
    rotationFolder.add(guiControls, 'rotationX', 0, 360).listen()
    rotationFolder.add(guiControls, 'rotationY', 0, 360).listen()
    rotationFolder.add(guiControls, 'rotationZ', 0, 360).listen()

    const colorFolder = gui.addFolder('color')
    colorFolder.addColor(guiControls, 'colorVec')
    colorFolder.add(guiControls, 'colorAlpha', 0, 1, 0.01)
}
