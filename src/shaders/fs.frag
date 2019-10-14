#version 300 es
precision highp float;

uniform vec4 color;
uniform vec2 resolution;
uniform float time;

out vec4 fragmentOutputColor;

void main() {
    fragmentOutputColor = color;
}
