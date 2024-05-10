import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import vertexShader from "./glsl/vertexShader.glsl?raw";
import fragmentShader from "./glsl/fragmentShader.glsl?raw";

interface CustomShaderMaterialParameters
  extends THREE.ShaderMaterialParameters {
  uniforms?: {
    [uniform: string]: { value: any };
  };
}

class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor(parameters?: CustomShaderMaterialParameters) {
    super({
      ...parameters,
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderMaterial.prototype.uniforms,
        parameters?.uniforms ?? {},
      ]),
    });
  }
}

function Rain({ count }: { count: number }) {
  const radius = 2;

  const points = useRef<THREE.Points>(null);
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (points.current) {
      const material = points.current.material as CustomShaderMaterial; // Assert type
      if (material.uniforms && material.uniforms.uTime) {
        material.uniforms.uTime.value = clock.elapsedTime;
      }
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
}

export default Rain;
