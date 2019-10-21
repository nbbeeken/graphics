#version 300 es
precision highp float;
precision highp int;

uniform vec2 resolution;
uniform float time;
uniform vec4 lightColor;

in vec3 vertexNormal;

in vec4 vertexColor;

out vec4 fragmentColor;

void main() {
    float ambientStrength = 0.1f;
    vec4 ambient = ambientStrength * lightColor;
    fragmentColor = ambient * vertexColor;
    fragmentColor.a = 1.0f;
}
