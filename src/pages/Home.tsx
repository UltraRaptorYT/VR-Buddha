import { VRButton, XR } from "@react-three/xr";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

function SkyBox() {
  const { scene } = useThree();
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
    "/1.jpg",
  ]);
  scene.background = texture;
  return null;
}

interface SpotlightBeamProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
}

function SpotlightBeam({ position, rotation }: SpotlightBeamProps) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[0.1, 1, 32]} />
      <meshBasicMaterial color="white" opacity={0.5} />
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
          <SpotlightBeam
            position={new THREE.Vector3(0, 0, -10)}
            rotation={new THREE.Euler(0, 0, 50)}
            scale={new THREE.Vector3(15, 15, 15)}
          />
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
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
