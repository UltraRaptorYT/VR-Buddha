import { useTexture } from "@react-three/drei";

function Buddha() {
  const texture = useTexture("Wen Shu.png");

  return (
    <mesh>
      <planeGeometry args={[66, 100]} />
      <meshBasicMaterial transparent map={texture} />
    </mesh>
  );
}

export default Buddha;
