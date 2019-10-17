#version 300 es
precision highp float;
precision highp int;

in vec4 position;
in vec4 color;
uniform mat4 transform;

out vec4 vertexColor;

void main() {
    gl_Position = transform * position;
    vertexColor = color;
}
