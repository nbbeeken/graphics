in vec4 color;

out vec4 vertexColor;
out vec3 vertexNormal;
out vec3 vertexPosition;

void main() {
    vertexColor = color;
    vertexNormal = mat3(transpose(inverse(modelViewMatrix))) * normal;
    vertexPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
}
