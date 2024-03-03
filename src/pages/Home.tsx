// import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { VRButton, XR } from "@react-three/xr";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { CubeTextureLoader } from "three";
// import { useState, useEffect } from "react";
// import { Group, Object3DEventMap } from "three";
// import Plane from "@/components/3D/Plane";

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ]);
  // const texture = loader.load([
  //   "/Nebula1.png",
  //   "/Nebula2.png",
  //   "/Nebula3.png",
  //   "/Nebula4.png",
  //   "/Nebula5.png",
  //   "/Nebula6.png",
  // ]);
  scene.background = texture;
  return null;
}

function Home() {
  // const [buddhaOBJ, setBuddhaOBJ] = useState<Group<Object3DEventMap> | null>(
  // const [showBuddha, setShowBuddha] = useState<boolean>(false);
  const buddhaOBJ = useLoader(OBJLoader, "/GuanYin.obj");

  // function generateNumber(max: number, min: number = 0) {
  //   return Math.random() * max + min;
  // }

  return (
    <>
      <VRButton />
      <Canvas>
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
          {/* <Controllers />
          <Hands /> */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh>
          {buddhaOBJ && (
            <primitive
              object={buddhaOBJ}
              position={[0, 0, -50]}
              scale={[1.5, 1.5, 1.5]}
            />
          )}
          <SkyBox />
          {/* {[...new Array(100)].map((idx) => {
            return (
              <mesh
                key={"star" + idx}
                scale={[0.1, 0.1, 0.1]}
                position={[
                  generateNumber(100, -100),
                  generateNumber(100, -100),
                  generateNumber(100, -100),
                ]}
              >
                <capsuleGeometry args={[8.5, 1, 8, 15]} />
                <meshBasicMaterial color="white" />
              </mesh>
            );
          })} */}
          {/* <Plane color="black" size={{ width: 1, height: 1 }} /> */}
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
