import { Suspense, useEffect, useState } from "react";
import { VRButton, XR } from "@react-three/xr";
import { Canvas, useThree } from "@react-three/fiber"; // useLoader
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import Snow from "@/components/3D/Snow";
import Buddha from "@/components/3D/Buddha";
import SpotlightBeam from "@/components/3D/SpotlightBeam";

function SkyBox() {
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "/6.jpg",
    "/3.jpg",
    "/4.jpg",
    "/1.jpg",
    "/5.jpg",
    "/2.jpg",
  ]);
  scene.background = texture;
  return null;
}

function Home() {
  const [showOffering, setShowOffering] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowOffering(true);
    }, 5000);
  }, []);

  return (
    <>
      <VRButton />
      <Canvas>
        <Suspense fallback={null}>
          <XR>
            <ambientLight intensity={0.055} color={"gold"} />
            {/* <pointLight position={[0.5, 0.5, 0.5]} /> */}
            <directionalLight
              castShadow
              position={[0.1, 0.1, 0.1]}
              shadow-mapSize-width={1024}
              color={"white"}
              intensity={1}
            />
            <Snow count={6000} hide={showOffering} />
            <mesh position={[0,0,-5]}>
              <coneGeometry args={[5, 1, 64]} />
              <meshBasicMaterial color={"green"} />
            </mesh>
            <SpotlightBeam
              meshProps={{
                position: [0, 0, -20],
                rotation: [0, -45, 0],
              }}
              opacity={0.5}
              color={"yellow"}
              startScale={[50, 30, 50]}
              endScale={[50, 50, 50]}
              expand={showOffering}
            />
            {/* <mesh position={[10, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh> */}
            <Buddha position={[0, -5, -50]} scale={[0.9, 0.9, 0.9]} />
            {/* {buddhaOBJ && (
              <primitive
                object={buddhaOBJ}
                position={[0, 0, -50]}
                scale={[1.25, 1.25, 1.25]}
              />
            )} */}
            <SkyBox />
          </XR>
        </Suspense>
      </Canvas>
    </>
  );
}

export default Home;
