#version 300 es
precision highp float;

in vec4 position;
in vec4 inColor;
uniform mat4 transform;

out vec4 vColor;

void main() {
    gl_Position = transform * position;
    vColor = inColor;
}
