import * as dat from "dat.gui"

export class GUIControls {
    gui: dat.GUI
    constructor(
        // Light Positioning
        public lightPositionX: number = 0,
        public lightPositionY: number = 0,
        public lightPositionZ: number = 10,

        public color: [number, number, number] = [25, 255, 25],

        public animate: boolean = false,
    ) {
        this.gui = new dat.GUI()

        this.gui.add(this, 'animate')

        const lightPositionFolder = this.gui.addFolder('light position')
        lightPositionFolder.add(this, 'lightPositionX', -10, 10, 1)
        lightPositionFolder.add(this, 'lightPositionY', -10, 10, 1)
        lightPositionFolder.add(this, 'lightPositionZ', 0, 20, 0.1)

        const colorFolder = this.gui.addFolder('color')
        colorFolder.addColor(this, 'color').listen()
    }

    get lightPosition(): [number, number, number] {
        return [this.lightPositionX, this.lightPositionY, this.lightPositionZ,]
    }


    rotationAnimation() { }
}
