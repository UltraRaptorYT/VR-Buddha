import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpotlightBeamProps {
  opacity: number;
  color: string;
  startScale: number[];
  endScale: number[];
  meshProps?: JSX.IntrinsicElements["mesh"];
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
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );
  const animationFrameId = useRef<number | null>(null);

  const scaleCone = (object: THREE.Mesh, scale: THREE.Vector3) => {
    // Calculate the current position of the tip of the cone
    const currentPosition = object.position.clone();

    // Scale the cone uniformly along its central axis
    object.scale.copy(scale);

    // Calculate the new position of the tip of the cone based on the scaling
    const newPosition = currentPosition.clone().multiply(scale);

    // Calculate the difference between the new and old positions
    const positionDifference = currentPosition.clone().sub(newPosition);

    // Adjust the position of the cone to keep the tip fixed
    object.position.add(positionDifference);
  };

  useEffect(() => {
    const targetScale = new THREE.Vector3(...endScale);
    const scalingSpeed = 0.01; // Adjust the speed as needed

    const updateScale = () => {
      // Calculate the new scale vector
      const newScale = currentScale.clone().lerp(targetScale, scalingSpeed);

      // Update the current scale state
      setCurrentScale(newScale);

      // Check if the scaling has reached the target
      if (newScale.distanceTo(targetScale) > 0.01) {
        animationFrameId.current = requestAnimationFrame(updateScale);
      }
    };

    if (expand) {
      // Start scaling
      updateScale();
    }

    // Clean up the effect
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [expand, currentScale, endScale]);

  useFrame(() => {
    if (mesh.current) {
      scaleCone(mesh.current, currentScale);
    }
  });

  return (
    <mesh ref={mesh} {...meshProps}>
      <coneGeometry args={[0.1, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export default SpotlightBeam;
