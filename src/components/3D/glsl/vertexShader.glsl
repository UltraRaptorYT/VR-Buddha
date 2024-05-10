uniform float uTime;
uniform float uRadius;

vec3 simulateSwagSnow(vec3 position, float speed, float swayAmount) {
    float y = position.y - uTime * 0.1 * sin(position.x * 0.1 + uTime * 0.1);
    float sway = sin(position.y * 0.1 + uTime * 0.1) * swayAmount;
    return vec3(position.x + sway, y, position.z - uTime * speed);
}

void main() {
    float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
    float size = distanceFactor * 0.5;
    vec3 particlePosition = simulateSwagSnow(position, 1, 0.1);
    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = size;
    gl_PointSize *= (1.0 / -viewPosition.z);
}
