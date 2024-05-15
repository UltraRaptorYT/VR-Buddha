import { Suspense, useEffect, useState } from "react";
import { VRButton, XR } from "@react-three/xr";
import { Canvas, useThree } from "@react-three/fiber"; // useLoader
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import Snow from "@/components/3D/Snow";
import Buddha from "@/components/3D/Buddha";
import SpotlightBeam from "@/components/3D/SpotlightBeam";
import { degreesToRads } from "@/lib/utils";

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
    }, 7500);
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
            <SpotlightBeam
              meshProps={{
                rotation: [degreesToRads(-70), 0, 0],
              }}
              opacity={0.5}
              color={"green"}
              startPosition={[0, 7, -20]}
              endPosition={[0, 0.2, -20]}
              startScale={[5, 1, 5]}
              endScale={[15, 50, 15]}
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
