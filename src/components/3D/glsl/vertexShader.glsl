uniform float uTime;
uniform float uRadius;

// Function to simulate snowfall with swag
vec3 simulateSwagSnow(vec3 position, float speed, float swayAmount) {
    // Calculate vertical motion with a sinusoidal oscillation
    float y = position.y - uTime * 0.1 * sin(position.x * 0.1 + uTime * 0.1);

    // Calculate horizontal drift/sway
    float sway = sin(position.y * 0.1 + uTime * 0.1) * swayAmount;

    return vec3(position.x + sway, y, position.z - uTime * speed); // Adjusted motion
}

void main() {
    // Calculate distance from center
    float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);

    // Calculate size of snowflakes based on distance
    float size = distanceFactor * 0.5;

    // Simulate snowflake motion with swag
    vec3 particlePosition = simulateSwagSnow(position, 1, 0.1); // Adjusted speed and swayAmount

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
