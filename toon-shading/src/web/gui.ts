import * as dat from "dat.gui"
type LEVEL_VALUES = 2 | 3 | 4
class GUIControls {
    gui: dat.GUI
    private _hasChanged = true
    constructor(
        private _lightPositionX: number = 9000,
        private _lightPositionY: number = 100,
        private _lightPositionZ: number = 8000,
        private _material: 'toon' | 'scribble' = 'scribble',
        private _color: 'ruby' | 'peridot' | 'sapphire' = 'peridot',
        private _geometry: 'box' | 'cone' | 'cylinder' | 'torus' = 'torus',
        private _levels: LEVEL_VALUES = 3,
        private _silhouetteWidth: number = 0.01,
        private _silhouetteColor: string = '#000000',
    ) {
        this.gui = new dat.GUI()

        this.gui.add(this, 'material', ['toon', 'scribble']).listen()
        this.gui.add(this, 'geometry', ['box', 'cone', 'cylinder', 'torus']).listen()

        const lightPositionFolder = this.gui.addFolder('light position')
        lightPositionFolder.add(this, 'lightPositionX', -10000, 10000, 10).listen()
        lightPositionFolder.add(this, 'lightPositionY', -10000, 10000, 10).listen()
        lightPositionFolder.add(this, 'lightPositionZ', 1, 10000, 10).listen()

        const toonSettingsFolder = this.gui.addFolder('toon settings')
        toonSettingsFolder.add(this, 'color', ['ruby', 'peridot', 'sapphire']).listen()

        const scribbleSettingsFolder = this.gui.addFolder('scribble settings')
        scribbleSettingsFolder.add(this, 'levels', [2, 3, 4]).listen()
        scribbleSettingsFolder.add(this, 'silhouetteWidth', 0.0, 0.2, 0.001).listen()
        scribbleSettingsFolder.addColor(this, 'silhouetteColor').listen()
    }

    get hasChanged() {
        if (this._hasChanged) {
            this._hasChanged = false
            return true
        }
        return false
    }

    get lightPosition(): [number, number, number] {
        return [this.lightPositionX, this.lightPositionY, this.lightPositionZ,]
    }

    get lightPositionX() { return this._lightPositionX }
    get lightPositionY() { return this._lightPositionY }
    get lightPositionZ() { return this._lightPositionZ }
    get material() { return this._material }
    get color() { return this._color }
    get geometry() { return this._geometry }
    get levels() { return +this._levels as LEVEL_VALUES }
    get silhouetteColor() { return this._silhouetteColor }
    get silhouetteWidth() { return this._silhouetteWidth }

    set lightPositionX(value) {
        this._hasChanged = true
        this._lightPositionX = value
    }
    set lightPositionY(value) {
        this._hasChanged = true
        this._lightPositionY = value
    }
    set lightPositionZ(value) {
        this._hasChanged = true
        this._lightPositionZ = value
    }
    set material(value) {
        this._hasChanged = true
        this._material = value
    }
    set color(value) {
        this._hasChanged = true
        this._color = value
    }
    set geometry(value) {
        this._hasChanged = true
        this._geometry = value
    }
    set levels(value) {
        this._hasChanged = true
        this._levels = +value as LEVEL_VALUES
    }
    set silhouetteColor(value: string) {
        this._hasChanged = true
        this._silhouetteColor = value
    }
    set silhouetteWidth(value) {
        this._hasChanged = true
        this._silhouetteWidth = value
    }
}

export const gui = new GUIControls()
