import * as dat from "dat.gui"
import { SupportedShapes, ShapeOptions } from "./shapes"
import { SupportedSubstances } from "./lakes"
type LEVEL_VALUES = 2 | 3 | 4

class GUIControls {
    gui: dat.GUI
    private _hasChanged = true
    constructor(
        // Display controls
        public lightPositionX: number = 9000,
        public lightPositionY: number = 100,
        public lightPositionZ: number = 8000,
        public material: 'toon' | 'scribble' = 'scribble',
        public substance: SupportedSubstances = 'peridot',
        public useColor: boolean = false,
        public ambientMaterial: string = '#FFFFFF',
        public diffuseMaterial: string = '#E0E0E0',
        public geometry: SupportedShapes = 'torus',
        public levels: LEVEL_VALUES = 3,
        public silhouetteWidth: number = 0.01,
        public silhouetteColor: string = '#000000',
        public clearColor: string = '#517777',
        public ambientGlobal: string = '#666666',
        public ambientLight: string = '#808080',
        public diffuseLight: string = '#CCCCCC',
        // System controls
        private forceUpdate = () => this._hasChanged = true,
        public showCanvases = false,
    ) {
        this.gui = new dat.GUI()
        document.body.style.background = this.clearColor
        const proxy = new Proxy(this, {
            set(target, name: keyof GUIControls, value) {
                target._hasChanged = true
                if (name === 'clearColor') {
                    document.body.style.background = target.clearColor
                }
                if (Object.getOwnPropertyDescriptor(target, name)?.configurable) {
                    //@ts-ignore
                    target[name] = value
                }
                return true
            }
        })

        this.gui.addColor(proxy, 'clearColor').listen()
        this.gui.add(proxy, 'material', ['toon', 'scribble']).listen()
        this.gui.add(proxy, 'geometry', ShapeOptions).listen()

        const lightPositionFolder = this.gui.addFolder('light position')
        lightPositionFolder.add(proxy, 'lightPositionX', -10000, 10000, 10).listen()
        lightPositionFolder.add(proxy, 'lightPositionY', -10000, 10000, 10).listen()
        lightPositionFolder.add(proxy, 'lightPositionZ', 1, 10000, 10).listen()

        const toonSettingsFolder = this.gui.addFolder('toon settings')
        toonSettingsFolder.add(proxy, 'substance', ['ruby', 'peridot', 'sapphire']).listen()
        toonSettingsFolder.add(proxy, 'useColor').listen()
        toonSettingsFolder.addColor(proxy, 'ambientMaterial').listen()
        toonSettingsFolder.addColor(proxy, 'diffuseMaterial').listen()

        const scribbleSettingsFolder = this.gui.addFolder('scribble settings')
        scribbleSettingsFolder.add(proxy, 'levels', [2, 3, 4]).listen()
        scribbleSettingsFolder.add(proxy, 'silhouetteWidth', 0.0, 0.2, 0.001).listen()
        scribbleSettingsFolder.addColor(proxy, 'silhouetteColor').listen()

        const environmentSettingsFolder = this.gui.addFolder('environment settings')
        environmentSettingsFolder.addColor(proxy, 'ambientGlobal').listen()
        environmentSettingsFolder.addColor(proxy, 'ambientLight').listen()
        environmentSettingsFolder.addColor(proxy, 'diffuseLight').listen()

        this.gui.add(proxy, 'forceUpdate')
        this.gui.add(proxy, 'showCanvases').listen()

        return proxy
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
}

export const gui = new GUIControls()
