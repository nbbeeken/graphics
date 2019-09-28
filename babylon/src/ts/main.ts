import { Application } from "pixi.js";

const view = document.getElementById("mainCanvas") as HTMLCanvasElement;

const app = new Application({ view });

export async function main() {
  console.dir(app);
}
