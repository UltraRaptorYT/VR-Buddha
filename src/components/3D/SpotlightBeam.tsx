import { useState, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpotlightBeamProps {
  opacity: number;
  color: string;
  startScale: number[];
  endScale: number[];
  startPosition: number[];
  endPosition: number[];
  meshProps?: JSX.IntrinsicElements["mesh"];
  expand: boolean;
  scaleMultiplier: number;
  setAnimationComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

function SpotlightBeam({
  opacity,
  color,
  meshProps,
  startScale,
  endScale,
  startPosition,
  endPosition,
  scaleMultiplier = 0.1,
  expand = false,
  setAnimationComplete,
}: SpotlightBeamProps) {
  const [currentScale, setCurrentScale] = useState(
    new THREE.Vector3(...startScale)
  );
  const [currentPosition, setCurrentPosition] = useState(
    new THREE.Vector3(...startPosition)
  );
  const mesh =
    useRef<THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>>(
      null
    );

  useFrame((_) => {
    if (mesh.current) {
      mesh.current.scale.copy(currentScale);
      mesh.current.position.copy(currentPosition);
    }
  });

  useEffect(() => {
    let animationFrameId: number = 0;

    const animate = () => {
      setCurrentScale((prevScale) => {
        const diff = new THREE.Vector3(...endScale)
          .sub(prevScale)
          .multiplyScalar(scaleMultiplier);
        const newScale = prevScale.clone().add(diff);
        if (
          newScale.distanceToSquared(new THREE.Vector3(...endScale)) < 0.0001
        ) {
          setAnimationComplete(true);
          return new THREE.Vector3(...endScale);
        }
        return newScale;
      });

      setCurrentPosition((prevPosition) => {
        const diff = new THREE.Vector3(...endPosition)
          .sub(prevPosition)
          .multiplyScalar(scaleMultiplier);
        const newPosition = prevPosition.clone().add(diff);
        if (
          newPosition.distanceToSquared(new THREE.Vector3(...endPosition)) <
          0.0001
        ) {
          setAnimationComplete(true);
          return new THREE.Vector3(...endPosition);
        }
        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    if (expand) {
      setAnimationComplete(false);
      animate();
    } else {
      cancelAnimationFrame(animationFrameId);
      setCurrentScale(new THREE.Vector3(...startScale));
      setCurrentPosition(new THREE.Vector3(...startPosition));
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [
    expand,
    endScale,
    endPosition,
    scaleMultiplier,
    setAnimationComplete,
    startScale,
    startPosition,
  ]);

  return (
    <mesh
      ref={mesh}
      {...meshProps}
      scale={currentScale}
      position={currentPosition}
    >
      <coneGeometry args={[0.25, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export default SpotlightBeam;
