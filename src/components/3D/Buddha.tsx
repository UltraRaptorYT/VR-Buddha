import { useTexture } from "@react-three/drei";

function Buddha(props?: JSX.IntrinsicElements["mesh"]) {
  const texture = useTexture("Wen Shu.png");

  return (
    <mesh {...props}>
      <planeGeometry args={[66, 100]} />
      <meshBasicMaterial transparent map={texture} />
    </mesh>
  );
}

export default Buddha;
