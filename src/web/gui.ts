import * as dat from "dat.gui"

export class GUIControls {
    constructor(
        public scale: number
    ) {}
}

export function initGui(guiControls: any) {
    const gui = new dat.GUI()
    gui.add(guiControls, 'scale', 0, 10)
}
