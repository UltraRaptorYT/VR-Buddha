import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { MutableRefObject, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "@/lib/pose_utils";

export default function CV() {
  let width = 960;
  let height = 720;
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function loadDetector() {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    setInterval(async () => {
      runDetector(detector);
    }, 100);
  }

  async function runDetector(detector: poseDetection.PoseDetector) {
    console.log("Running Detector");
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current?.video !== null &&
      webcamRef.current?.video.readyState === 4
    ) {
      const video = webcamRef.current?.video;
      const videoWidth = webcamRef.current?.video.videoWidth;
      const videoHeight = webcamRef.current?.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const poses = await detector.estimatePoses(video);
      console.log(poses[0]);
      drawCanvas(poses[0], video, videoWidth, videoHeight, canvasRef);
    }
  }

  const drawCanvas = (
    poses: poseDetection.Pose,
    video: HTMLVideoElement,
    videoWidth: number,
    videoHeight: number,
    canvas: MutableRefObject<HTMLCanvasElement | null>
  ) => {
    if (canvas.current && poses && video) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(poses["keypoints"], 0.5, ctx);
        drawSkeleton(poses["keypoints"], 0.5, ctx);
      }
    }
  };

  async function loadTF() {
    await tf.ready();
    await tf.setBackend("webgl");
    await loadDetector();
  }

  useEffect(() => {
    loadTF();
  }, []);

  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: width,
          height: height,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: width,
          height: height,
        }}
      />
    </div>
  );
}
