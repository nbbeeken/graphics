import * as dat from "dat.gui"

export class GUIControls {
    gui: dat.GUI
    constructor(
        // Light Positioning
        public lightPositionX: number = 0,
        public lightPositionY: number = 0,
        public lightPositionZ: number = 10,

        public illuminatedColor: [number, number, number] = [165, 56, 152],
        public shadowedColor: [number, number, number] = [26, 23, 82],

        public shader: 'toon' | 'scribble' = 'toon',
        public material: 'ruby' | 'peridot' | 'sapphire' = 'peridot',
        public geometry: 'box' | 'cone' | 'cylinder' | 'torus' = 'torus',
    ) {
        this.gui = new dat.GUI()

        this.gui.add(this, 'shader', ['toon', 'scribble']).listen()
        this.gui.add(this, 'material', ['ruby', 'peridot', 'sapphire']).listen()
        this.gui.add(this, 'geometry', ['box', 'cone', 'cylinder', 'torus']).listen()

        const lightPositionFolder = this.gui.addFolder('light position')
        lightPositionFolder.add(this, 'lightPositionX', -10, 10, 1).listen()
        lightPositionFolder.add(this, 'lightPositionY', -10, 10, 1).listen()
        lightPositionFolder.add(this, 'lightPositionZ', 0, 20, 0.1).listen()
    }

    get lightPosition(): [number, number, number] {
        return [this.lightPositionX, this.lightPositionY, this.lightPositionZ,]
    }

    rotationAnimation() { }
}
