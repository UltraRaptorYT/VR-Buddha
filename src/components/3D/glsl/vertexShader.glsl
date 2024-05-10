uniform float uTime;
uniform float uRadius;

// Function to simulate vertical motion of raindrops
vec3 simulateRain(vec3 position, float speed) {
    float y = mod(position.y - uTime * speed, uRadius * 2.0);
    return vec3(position.x, y, position.z);
}

void main() {
    // Calculate distance from center
    float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);

    // Calculate size of raindrops based on distance
    float size = distanceFactor * 0.5;

    // Simulate raindrop motion
    vec3 particlePosition = simulateRain(position, 10.0);

    // Apply transformations
    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Set final position
    gl_Position = projectedPosition;

    // Set point size based on distance
    gl_PointSize = size;

    // Size attenuation
    gl_PointSize *= (1.0 / -viewPosition.z);
}
