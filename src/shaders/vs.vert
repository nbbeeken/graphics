#version 300 es

/**
 * Implicitly declared:
 * in highp int gl_VertexID;
 * in highp int gl_InstanceID;
 * out highp vec4 gl_Position;
 * out highp float gl_PointSize;
**/

in vec4 position;

void main() {
    gl_Position = position;
}
