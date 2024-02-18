// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { useRef } from "react";
import { VRButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";
import Plane from "@/components/3D/Plane";

function Home() {
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
          <Plane color="black" size={{ width: 20, height: 20 }} />
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
