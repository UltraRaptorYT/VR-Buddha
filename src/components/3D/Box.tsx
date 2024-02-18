import { DoubleSide } from "three";

type BoxProps = {};

export default function Box(props: BoxProps) {
  return (
    <mesh {...props}>
      <boxGeometry args={[10, 5]} />
      <meshStandardMaterial color="red" side={DoubleSide} />
    </mesh>
  );
}
