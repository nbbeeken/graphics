import { Scene } from "three/src/scenes/Scene"
import { Mesh } from "three/src/objects/Mesh"
import { Object3D } from "three/src/core/Object3D"

import shuttleURL from '../assets/shuttle.json'
import { Painter } from "./painter"
import { Inker } from "./inker"
import { Color, Vector3, ObjectLoader } from "three"

export class PerformanceTonalShading {

    async loadComplex() {
        var loader = new ObjectLoader()
        return new Promise<Object3D>((resolve, reject) => {
            loader.load(shuttleURL, resolve, undefined, reject)
        })
    }

    async run(scene: Scene) {
        let shuttleBase = await this.loadComplex()

        let geo
        shuttleBase.traverse(ch => {
            if (ch.type === 'Mesh') {
                //@ts-ignore
                geo = ch.geometry
            } else {
                console.log(ch)
            }
        })
        let combine = new Mesh(geo)
        console.log(JSON.stringify(combine.toJSON()))


        for (let i = 0; i < 5; i++) {
            const shuttle = combine.clone(true)
            const painter = new Painter()
            painter.customColors = {
                ambientMaterial: new Vector3(...new Color(Math.random() * 0xFFFFFF).toArray().map(v => v * 255)),
                diffuseMaterial: new Vector3(...new Color(Math.random() * 0xFFFFFF).toArray().map(v => v * 255)),
            }

            shuttle.traverse(child => {
                if (child instanceof Mesh) {
                    child.material = painter
                    child.onBeforeRender = () => {
                        child.material = painter
                    }
                }
            })
            shuttle.translateX(1000 * i)

            const shuttleShadow = shuttleBase.clone(true)
            const inker = new Inker()
            shuttleShadow.traverse(child => {
                if (child instanceof Mesh) {
                    child.material = inker
                    child.onBeforeRender = () => {
                        child.material = inker
                    }
                }
            })
            shuttleShadow.translateX(1000 * i)

            scene.add(shuttle, shuttleShadow)
        }
    }


}

// complexGeometry.computeVertexNormals()
        // for (let i = 0; i < 1; i++) {
        //     const mesh = new Mesh(complexGeometry, this.painter.material)
        //     const shadow = new Mesh(complexGeometry, this.inker.material)
        //     mesh.position.x = Math.random() * 8000 - 4000
        //     mesh.position.y = Math.random() * 8000 - 4000
        //     mesh.position.z = Math.random() * 8000 - 4000
        //     shadow.position.x = mesh.position.x
        //     shadow.position.y = mesh.position.y
        //     shadow.position.z = mesh.position.z
        //     // mesh.rotation.x = Math.random() * 2 * Math.PI
        //     // mesh.rotation.y = Math.random() * 2 * Math.PI
        //     mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 100
        //     // objects.push(mesh);
        //     this.add(mesh, shadow)
        // }
