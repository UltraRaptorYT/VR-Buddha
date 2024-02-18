import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { DoubleSide } from "three";

function Home() {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            shadow-mapSize-width={1024}
          />
          <Controllers />
          <Hands />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[10, 5]} />
            <meshStandardMaterial color="royalBlue" side={DoubleSide} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
