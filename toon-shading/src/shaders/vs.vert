#version 300 es
precision highp float;
precision highp int;

in vec3 position;
in vec4 color;
in vec4 normal;

uniform mat4 transform;

out vec4 vertexColor;

void main() {
    gl_Position = transform * vec4(position, 1.0);
    vertexColor = color;
}
