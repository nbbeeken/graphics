# September 23rd

## Transformations

- Rotation
  - Transform principal axis to base axis (x,y,z) (can be any)
  - Rotate to align with chosen base axis
  - Perform the actual rotation about the axis (This results in the simplest math)
    - Example rotate $\theta$:
        1. Transform(-a)
        2. Rotate(x, $\alpha$)
        3. Rotate(y, $\beta$)
        4. Rotate(z, $\theta$)
        5. Rotate(y, -$\beta$)
        6. Rotate(x, -$\alpha$)
        7. Transform(a)
- Translation
- Scale
