import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DoubleSide, Mesh } from "three";

type PlaneProps = {
  color: string;
  size?: {
    width: number;
    height: number;
  };
};

export default function Plane(props: PlaneProps) {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref} {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[props.size?.width, props.size?.height]} />
      <meshStandardMaterial color={props.color} side={DoubleSide} />
    </mesh>
  );
}
