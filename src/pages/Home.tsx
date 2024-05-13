import { Suspense } from "react";
import { VRButton, XR } from "@react-three/xr";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";
import Snow from "@/components/3D/Snow";
import Buddha from "@/components/3D/Buddha";

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

interface SpotlightBeamProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  opacity: number;
  color: string;
}

function SpotlightBeam({
  position,
  rotation,
  scale,
  opacity,
  color,
}: SpotlightBeamProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[0.1, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
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
            <Snow count={6000} />
            <SpotlightBeam
              position={new THREE.Vector3(0, 0, -20)}
              rotation={new THREE.Euler(0, -45, 0)}
              scale={new THREE.Vector3(50, 30, 50)}
              opacity={0.5}
              color={"yellow"}
            />
            {/* <mesh position={[10, 0.1, 0]}>
            <boxGeometry />
            <meshBasicMaterial color="gold" />
          </mesh> */}
            <Buddha />
            {buddhaOBJ && (
              <primitive
                object={buddhaOBJ}
                position={[0, 0, -50]}
                scale={[1.25, 1.25, 1.25]}
              />
            )}
            <SkyBox />
          </XR>
        </Suspense>
      </Canvas>
    </>
  );
}

export default Home;
