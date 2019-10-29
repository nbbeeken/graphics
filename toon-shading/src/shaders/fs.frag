// Uniforms
uniform vec2 resolution;
uniform float time;
uniform vec4 lightColor;
uniform vec3 lightPosition;

// Inputs
in vec3 vertexNormal;
in vec4 vertexColor;
in vec3 vertexPosition;

// Outputs
// gl_FragColor

// constants
const float ambientStrength = 0.1f;

// Function declarations
vec4 lakesIlluminatedDiffuseColor();
vec4 lakesShadowedDiffuseColor();
vec4 lakesShading(vec3 normal, vec3 lightPosition);

// Entry
void main() {
    vec3 ambient = vec3(ambientStrength * lightColor);

    vec3 normal = normalize(vertexNormal);
    vec3 lightDirection = normalize(lightPosition - vertexPosition);
    float diffusion = max(dot(normal, lightDirection), 0.0);
    vec3 diffuse = diffusion * lightColor.rbg;

    gl_FragColor.rbg = (ambient + diffuse) * vertexColor.rbg;
    gl_FragColor.a = 1.0f;
}

vec4 lakesShading(vec3 normal, vec3 lightPosition) {
    vec4 illuminatedDiffuseColor = vec4(0.0f);
    vec4 shadowedDiffuseColor = vec4(0.0f);
    return vec4(0.0f);
}
