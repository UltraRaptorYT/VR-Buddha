// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { VRButton, XR } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useLoader } from "@react-three/fiber";
import { useState, useEffect } from "react";
// import Plane from "@/components/3D/Plane";

function Home() {
  const [showBuddha, setShowBuddha] = useState<boolean>(false);

  const obj = useLoader(OBJLoader, "/GuanYin.obj");

  useEffect(() => {
    setTimeout(() => {
      setShowBuddha(true);
    }, 5000);
  }, []);

  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <ambientLight />
          {/* <pointLight position={[0.5, 0.5, 0.5]} /> */}
          {/* <directionalLight
            castShadow
            position={[0.1, 0.1, 0.1]}
            shadow-mapSize-width={1024}
            color={"yellow"}
          /> */}
          {/* <Controllers />
          <Hands /> */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh>
          <mesh>
            {showBuddha ? (
              <primitive
                object={obj}
                position={[0, 2.5, -50]}
                scale={[1.5, 1.5, 1.5]}
              />
            ) : (
              <>
                <boxGeometry />
                <meshBasicMaterial color="blue" />
              </>
            )}
          </mesh>
          {/* <Plane color="black" size={{ width: 1, height: 1 }} /> */}
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
