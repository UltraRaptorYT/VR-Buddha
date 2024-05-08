import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function CVRoom() {
  let { room_id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  let width = 960 / 1.1;
  let height = 720 / 1.1;

  useEffect(() => {
    const localStream = canvasRef.current.captureStream();
    console.log(localStream)
  }, [canvasRef]);

  // <ViewerCard
  //   sourceConfig={sourceConfig}
  //   backgroundConfig={backgroundConfig}
  //   segmentationConfig={segmentationConfig}
  //   postProcessingConfig={postProcessingConfig}
  //   bodyPix={bodyPix}
  //   tflite={tflite}
  // />;

  return (
    <canvas
      // The key attribute is required to create a new canvas when switching
      // context mode
      // key={props.segmentationConfig.pipeline}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
}
