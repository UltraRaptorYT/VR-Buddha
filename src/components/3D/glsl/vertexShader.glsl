// Uniforms
uniform float uTime;  // Time uniform to control animation
uniform mat4 uModelViewProjectionMatrix;  // Model-View-Projection matrix

// Attributes
attribute vec3 aPosition;  // Vertex position

// Varying
varying float vAlpha;  // Alpha value for fading snowflakes

void main() {
    // Calculate the position of the vertex
    vec3 position = aPosition;

    // Simulate falling snow effect
    float speed = 0.1;  // Adjust the speed of falling snow
    float scale = 0.01;  // Adjust the size of snowflakes
    float offset = mod(position.y - uTime * speed, 2.0);  // Apply vertical movement
    position.y = offset;

    // Calculate alpha value for fading snowflakes based on their y position
    vAlpha = 1.0 - smoothstep(0.0, 1.0, abs(position.y) / 2.0);

    // Apply the model-view-projection matrix to the vertex position
    gl_Position = uModelViewProjectionMatrix * vec4(position, 1.0);

    // Set the size of snowflakes
    gl_PointSize = 10.0 * scale;
}
