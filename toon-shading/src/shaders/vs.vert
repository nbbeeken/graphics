#version 300 es
precision highp float;
precision highp int;

in vec3 position;
in vec4 color;
in vec3 normal;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

out vec4 vertexColor;
out vec3 vertexNormal;
out vec3 vertexPosition;

void main() {
    gl_Position = projection *  view * model * vec4(position, 1.0);
    vertexColor = color;
    vertexNormal = mat3(transpose(inverse(model))) * normal;
    vertexPosition = vec3(model * vec4(position, 1.0));
}
