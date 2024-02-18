import { VRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Home() {
  return (
    <>
      <VRButton />
      <Canvas>
        <XR>
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            shadow-mapSize-width={1024}
          />
          <Controllers />
          <Hands />
          {/* <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh> */}
          <Box
            position={[0, -0.05, 0]}
            scale={[100, 0.1, 100]}
            rotation={[0, 0, 0]}
            receiveShadow
          >
            <meshStandardMaterial color="white" />
          </Box>
        </XR>
      </Canvas>
    </>
  );
}

export default Home;
