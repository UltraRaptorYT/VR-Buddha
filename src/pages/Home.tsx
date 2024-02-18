import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
// import { DoubleSide } from "three";

function Home() {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight />
          <pointLight position={[0.5, 0.5, 0.5]} />
          <directionalLight
            castShadow
            position={[0.5, 0.5, 0.5]}
            shadow-mapSize-width={1024}
          />
          <Controllers />
          <Hands />
          <mesh position={[0.1, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
