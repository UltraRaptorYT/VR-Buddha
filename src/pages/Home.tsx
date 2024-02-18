// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { useRef } from "react";
import { VRButton, XR } from "@react-three/xr";
import { Canvas, useFrame } from "@react-three/fiber";
import { DoubleSide, Mesh } from "three";

function Home() {
  const ref = useRef(null);

  useFrame(() => {
    if (ref.current) {
      (ref.current as Mesh).rotation.y += 0.01;
    }
  });
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          {/* <ambientLight /> */}
          {/* <pointLight position={[0.5, 0.5, 0.5]} /> */}
          <directionalLight
            castShadow
            position={[0.1, 0.1, 0.1]}
            shadow-mapSize-width={1024}
          />
          {/* <Controllers />
          <Hands /> */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[10, 5]} />
            <meshBasicMaterial color="gold" />
          </mesh>
          <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 5]} />
            <meshStandardMaterial color="black" side={DoubleSide} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
