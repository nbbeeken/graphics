import * as dat from "dat.gui"

export class GUIControls {
    gui: dat.GUI
    constructor(
        // Light Positioning
        public lightPositionX: number = 0,
        public lightPositionY: number = 0,
        public lightPositionZ: number = 10,

        public material: 'toon' | 'scribble' = 'toon',
        public color: 'ruby' | 'peridot' | 'sapphire' = 'peridot',
        public geometry: 'box' | 'cone' | 'cylinder' | 'torus' = 'torus',

        // Scribble Settings
        public levels: 2 | 3 | 4 = 3,
    ) {
        this.gui = new dat.GUI()

        this.gui.add(this, 'material', ['toon', 'scribble']).listen()
        this.gui.add(this, 'geometry', ['box', 'cone', 'cylinder', 'torus']).listen()

        const lightPositionFolder = this.gui.addFolder('light position')
        lightPositionFolder.add(this, 'lightPositionX', -10, 10, 1).listen()
        lightPositionFolder.add(this, 'lightPositionY', -10, 10, 1).listen()
        lightPositionFolder.add(this, 'lightPositionZ', 0, 20, 0.1).listen()

        const toonSettingsFolder = this.gui.addFolder('toon settings')
        toonSettingsFolder.add(this, 'color', ['ruby', 'peridot', 'sapphire']).listen()

        const scribbleSettingsFolder = this.gui.addFolder('scribble settings')
        scribbleSettingsFolder.add(this, 'levels', [2, 3, 4]).listen()
    }

    get lightPosition(): [number, number, number] {
        return [this.lightPositionX, this.lightPositionY, this.lightPositionZ,]
    }

    rotationAnimation() { }
}
