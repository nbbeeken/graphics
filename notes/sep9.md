# September 9th

> Neal Beeken

## Devices

### Raster devices

- Raster devices work on a 2D grid format, each pixel can be seen as a unit in a 2D array (or 1D with some math).
- `Absolute resolution` is the limitation of the screen: example is crt monitor that can't paint beyond the physics of electrons.
- Horizontal `Re-trace` is how crt goes across the screen to paint each pixel.
- `bit depth`: Number of bits per pixel needed to represent color etc.
- `Logical resolution` is software level resolution, like low res images displaying on higher res screens.
- `Dithering` or `half-toning` you can mix colors to represent ones beyond display capability. Like levels of gray represented by clustering different amounts of black and white pixels.

### Vector device

Vector devices work on a higher level that take instructions to draw an image.

## Color

RBG model mixing red green and blue we can create any color on screen.
A crt has all three colors very close together to represent every pixel.

## Pipelines

3D Geometry or 2D graphics

Closed regions, and wind number for polygons that overlap themselves (think star)

`Normal` of a plane effects lighting or changing images based on a function that depends on the `Normal`

### Geometry Pipeline

- Animation
- Modeling
- Shading
- Transformation
- Hidden Surface Elimination

### Imaging pipeline

- Rasterization
- Texture mapping
- Image Composition
- Intensity and color quantization
- Framebuffer display

## Rasterization

The process of turning a complex vector into a set of pixels (matrix representation).

- there is naive way
- DDA Digital Differential Analyzer (worst)
- Bresenham algorithm (best line drawing algorithm)

- `y = mx + b` is the explicit representation of a line.
- `ax + by + c = 0` is implicit representation of a line. (`f(x,y) = 0`)
  - This gives use midpoint algo: If the midpoint is negative then you can pick the pixel above vs below
  - this assumes slope is `0 <= m <= 1`
- `x^2 + y^2 - r^2 = 0` Implicit representation of a circle
- `(x^2 / a^2) + (y^2 / b^2) - 1 = 0` Implicit representation of a elipse

## Scan

Filling polygons is an intresting problem of its own.
Scan-line approach - for each y value compute x intersections fill according to winding rule.

Computing intersection is not cheap

### Cohen-Sutherland Clipping

`top, bottom, right, left`.

`tbrl` value := 0 is negative, 1 is positive

|      |      |      |
|:----:|:----:|:----:|
|`1001`|`1000`|`1010`|
|`0001`|`0000`|`0010`|
|`0101`|`0100`|`0110`|
