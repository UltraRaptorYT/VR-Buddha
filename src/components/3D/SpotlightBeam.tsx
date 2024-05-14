import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpotlightBeamProps {
  opacity: number;
  color: string;
  startScale: number[];
  endScale: number[];
  meshProps?: JSX.IntrinsicElements["instancedMesh"];
  expand: boolean;
}

function SpotlightBeam({
  opacity,
  color,
  meshProps,
  startScale,
  endScale,
  expand = false,
}: SpotlightBeamProps) {
  const [currentScale, setCurrentScale] = useState(
    new THREE.Vector3(...startScale)
  );
  const mesh =
    useRef<
      THREE.InstancedMesh<
        THREE.BufferGeometry,
        THREE.Material | THREE.Material[],
        THREE.InstancedMeshEventMap
      >
    >(null); // Change useRef type

  useFrame((_) => {
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (expand) {
      // Animate to endScale when hide is true
      const interval = setInterval(() => {
        setCurrentScale((prevScale) => {
          const diff = new THREE.Vector3(...endScale)
            .sub(prevScale)
            .multiplyScalar(0.1);
          const newScale = prevScale.clone().add(diff);
          if (
            newScale.distanceToSquared(new THREE.Vector3(...endScale)) < 0.0001
          ) {
            clearInterval(interval);
            return new THREE.Vector3(...endScale);
          }
          return newScale;
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [expand, endScale]);

  return (
    <instancedMesh ref={mesh} {...meshProps} scale={currentScale}>
      <coneGeometry args={[0.1, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </instancedMesh>
  );
}

export default SpotlightBeam;
