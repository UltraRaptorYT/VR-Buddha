import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function Snow({ count, hide = false }: { count: number; hide?: boolean }) {
  const mesh = useRef<THREE.InstancedMesh<
    THREE.BufferGeometry,
    THREE.Material | THREE.Material[],
    THREE.InstancedMeshEventMap
  > | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const xFactor = -25 + Math.random() * 75;
      const yFactor = 0 + Math.random() * 100; // Adjust yFactor for upward initial movement
      const zFactor = -25 + Math.random() * 75;
      const speed = Math.random() * 0.05; // Decrease the value to slow down the snowfall
      temp.push({ t, xFactor, yFactor, zFactor, speed });
    }
    return temp;
  }, [count]);
  // The innards of this hook will run every frame
  useFrame((_) => {
    particles.forEach((particle, i) => {
      let { t, xFactor, yFactor, zFactor, speed } = particle;
      t = particle.t += 0.0001; // Adjust speed as needed

      // Adjust y position to simulate slower falling
      particle.yFactor -= speed;

      if (particle.yFactor < -50) {
        particle.yFactor = 0 + Math.random() * 50; // Reset y position to top
      }

      // Add rotation and sway to the snow particles
      const rotationFactor = Math.sin(t / 20) * 0.05;
      const swayFactorX = Math.sin(t / 8) * 0.5; // Increased sway on X axis
      const swayFactorZ = Math.cos(t / 8) * 0.5; // Increased sway on Z axis
      dummy.position.set(
        xFactor + Math.cos(t / 10) + Math.sin(t * 1) / 10 + swayFactorX * 10,
        yFactor,
        zFactor + Math.sin(t / 10) + Math.cos(t * 2) / 10 + swayFactorZ * 10
      );
      dummy.rotation.set(rotationFactor, rotationFactor, rotationFactor);
      dummy.updateMatrix();

      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });
  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      position={[0, 0, 0]}
      scale={hide ? 0 : 1}
    >
      <sphereGeometry attach="geometry" args={[0.1, 0]} />
      <meshBasicMaterial
        attach="material"
        color="gold"
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  );
}

export default Snow;
