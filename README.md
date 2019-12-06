# Neal's Graphics Experiment

In `toon-shading` is a typescript webgl project that emulates the work described in the 2000 paper __Stylized Rendering Techniques for Scalable Real-Time 3D Animation__.

The current production build of the project can be found in the `docs/` folder. A quick way to try it out is to just open the `docs/index.html` file in a modern browser.

Refer to the [readme inside](toon-shading/README.md) for information on how to run the project locally

## Support

- Chrome 78+
- Firefox 71+

## Libraries

- [three.js](https://threejs.org/) - A modern 3D rendering library
  - Usage: Shader uniform setter, Basic 3D Geometries, Projection matrix (camera), Controls
- [dat.gui](https://github.com/dataarts/dat.gui) - A simple gui for changing parameter values
  - Usage: change values for shading, shapes, and performance
- [stats.js](https://github.com/mrdoob/stats.js/)
  - Usage: adds an FPS counter to the corner of the webpage
- [typescript*](https://www.typescriptlang.org/)
  - Usage: The language provides modern JS practices as well as compile time type checking drastically improving developer well-being :coffee:
- [webpack*](https://webpack.js.org/)
  - Usage: Build tool, compiles typescript, bundles javascript, minifies everything

> *Not really a library

## Reference

> Adam Lake, Carl Marshall, Mark Harris, and Marc Blackstein. "Stylized Rendering Techniques for Scalable Real-Time 3D Animation." Proceedings of the First International Symposium on Non-Photorealistic Animation and Rendering - NPAR 00, 2000. <http://www.markmark.net/npar/npar2000_lake_et_al.pdf>
