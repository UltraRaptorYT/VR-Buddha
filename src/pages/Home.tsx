// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { VRButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";
// import Plane from "@/components/3D/Plane";

function Home() {
  const obj = useLoader(OBJLoader, "/GuanYin.obj");

  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight />
          {/* <pointLight position={[0.5, 0.5, 0.5]} /> */}
          <directionalLight
            castShadow
            position={[0.1, 0.1, 0.1]}
            shadow-mapSize-width={1024}
          />
          {/* <Controllers />
          <Hands /> */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh>
          <primitive object={obj} position={[0, 0, -50]} scale={[1.5, 1.5, 1.5]} />
          {/* <Plane color="black" size={{ width: 1, height: 1 }} /> */}
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
