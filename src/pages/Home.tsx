// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { VRButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
// import Plane from "@/components/3D/Plane";

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
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh>
          {/* <Plane color="black" size={{ width: 1, height: 1 }} /> */}
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
