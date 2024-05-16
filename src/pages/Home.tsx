import React, { Suspense, useEffect, useState } from "react";
import { VRButton, XR, XREvent, XRManagerEvent } from "@react-three/xr";
import { Canvas, useThree } from "@react-three/fiber"; // useLoader
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import Snow from "@/components/3D/Snow";
import Buddha from "@/components/3D/Buddha";
import SpotlightBeam from "@/components/3D/SpotlightBeam";
import { degreesToRads } from "@/lib/utils";

function SkyBox() {
  const { scene, camera } = useThree();
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
  camera.near = 0.01; // Adjust this value according to your scene's scale
  camera.far = 1000; // Adjust this value according to your scene's scale

  camera.updateProjectionMatrix();
  return null;
}

function Home({
  showOffering,
  setShowOffering,
  roomMode = false,
}: {
  showOffering: boolean;
  setShowOffering: React.Dispatch<React.SetStateAction<boolean>>;
  roomMode?: boolean;
}) {
  let [animationComplete, setAnimationComplete] = useState<boolean>(false);

  useEffect(() => {
    if (animationComplete) {
      setTimeout(() => {
        setShowOffering(false);
      }, 1000);
    }
  }, [animationComplete]);

  return (
    <>
      <VRButton />
      <Canvas>
        <Suspense fallback={null}>
          <XR
            onSessionStart={(event: XREvent<XRManagerEvent>) => {
              console.log(event);
              if (!roomMode) {
                setTimeout(() => {
                  setShowOffering(true);
                }, 7500);
              }
            }}
          >
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
                rotation: [degreesToRads(-80), 0, 0],
              }}
              opacity={0.5}
              color={"gold"}
              startPosition={[0, 7, -20]}
              endPosition={[0, 3, -20]}
              startScale={[0, 0, 0]}
              endScale={[15, 40, 15]}
              scaleSpeed={16}
              scaleMultiplier={0.01}
              expand={showOffering}
              setAnimationComplete={setAnimationComplete}
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
