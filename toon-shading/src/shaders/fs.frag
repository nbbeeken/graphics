#version 300 es
precision highp float;
precision highp int;

uniform vec2 resolution;
uniform float time;

in vec4 vertexColor;

out vec4 fragmentColor;

void main() {
    fragmentColor = vertexColor;
}
