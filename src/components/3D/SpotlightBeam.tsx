interface SpotlightBeamProps {
  opacity: number;
  color: string;
  meshProps?: JSX.IntrinsicElements["mesh"];
}

function SpotlightBeam({ opacity, color, meshProps }: SpotlightBeamProps) {
  return (
    <mesh {...meshProps}>
      <coneGeometry args={[0.1, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

export default SpotlightBeam;
