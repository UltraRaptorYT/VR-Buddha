import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

function Snow({ count }: { count: number }) {
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
      const xFactor = -50 + Math.random() * 100;
      const yFactor = 50 + Math.random() * 100; // Adjust yFactor for upward initial movement
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, xFactor, yFactor, zFactor });
    }
    return temp;
  }, [count]);
  // The innards of this hook will run every frame
  useFrame((_) => {
    particles.forEach((particle, i) => {
      let { t, xFactor, yFactor, zFactor } = particle;
      t = particle.t += 0.001; // Adjust speed as needed

      // Adjust y position to simulate falling
      particle.yFactor -= 0.1; // Adjust the value as needed for the falling speed

      dummy.position.set(
        xFactor + Math.cos(t / 10) + Math.sin(t * 1) / 10,
        yFactor,
        zFactor + Math.sin(t / 10) + Math.cos(t * 2) / 10
      );
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
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry attach="geometry" args={[0.075, 0]} />
      <meshBasicMaterial attach="material" color="gold" opacity={0.5} />
    </instancedMesh>
  );
}

export default Snow;
