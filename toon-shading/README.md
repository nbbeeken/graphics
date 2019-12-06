# Toon Shading

## How to setup

### Prerequisites

- [nodejs](https://nodejs.org/en/) along with its package manager `npm` (comes with it). I tested / developed with version 12 but 10+ should work.

### Get Dependencies

This may take a minute:

```sh
npm install
```

### Running locally

```sh
npm run start:dev
```

By default you can now access the site at <http://localhost:1234>

### Discover

Wanna know more about how the pipeline works follow this guide:

- In [`src/web/main.ts`](src/web/main.ts) is where the project begins with a very un-web-like main function.
  - After initializing the controls, canvas and various counters the animation loop is started. Using the web api `requestAnimationFrame` we are guaranteed native framerate animations.
- In [`src/web/lakes.ts`](src/web/lakes.ts) is where the lake shading algorithm is implemented (at least the color calculations).
  - Using the formula from the paper I have two functions for getting the illuminated and shaded colors for an object, this is used by the painter.
- In [`src/web/painter.ts`](src/web/painter.ts)
  - Using colors provided by lake calculations this class is responsible for setting the correct uniform values on each frame.
  - The vertex and fragment shaders are properties of this class capable of dealing with the toon and scribble shading features.
- In [`src/web/inker.ts`](src/web/inker.ts)
  - Unlike in the paper the silhouette method does not use edge detection but rather goes the hardware route of repainting the geometry's _back face_ in black (by default) which achieves the same effect without costly runtime calculations.
  - The shaders in this class are responsible for correctly offsetting the silhouette geometry as well as enabling the alpha channel on sections that should not be in shadow.
- In [`src/web/animator.ts`](src/web/animator.ts)
  - This class is responsible for the motion lines often used to indicate an objects direction in a static picture.
  - This feature was added last and does not work very well, but it does work, with 1 object.
- In [`src/web/tonal.ts`](src/web/tonal.ts)
  - This class allows me to add an arbitrary number of tonal shaded objects by managing painter, inker, and animator, in simple unison.
- In [`src/web/gui.ts`](src/web/gui.ts)
  - This class contains all the mutable parameters for the graphics pipeline, I tried to make the project as malleable as possible to give the user the freedom to experiment.
