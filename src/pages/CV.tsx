import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { MutableRefObject, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "@/lib/pose_utils";

export default function CV() {
  let width = 960;
  let height = 720;
  let kneelAngle = 105;
  let prayHandDistance = 25;
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
    console.log("Running Detector");
    setInterval(async () => {
      runDetector(detector);
    }, 100);
  }

  async function runDetector(detector: poseDetection.PoseDetector) {
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
      drawCanvas(poses[0], video, videoWidth, videoHeight, canvasRef);
    }
  }
  type Coordinate = {
    x: number;
    y: number;
  };

  const degreesToRads = (deg: number) => (deg * Math.PI) / 180.0;
  // const radsToDegrees = (rad: number) => (rad * 180.0) / Math.PI;

  const calculateDistance = (
    point1: Coordinate,
    point2: Coordinate
  ): number => {
    if (point1 && point2) {
      return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    } else {
      return 0;
    }
  };

  const cosineRule = (x: Coordinate, y: Coordinate, z: Coordinate): number => {
    let a = calculateDistance(x, z);
    let b = calculateDistance(y, z);
    let c = calculateDistance(x, y);

    let angle = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
    return angle;
  };

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
        let color = "aqua";

        // Check Kneeling
        let leftLegRadAngle = cosineRule(
          poses.keypoints[11],
          poses.keypoints[13],
          poses.keypoints[15]
        );

        let rightLegRadAngle = cosineRule(
          poses.keypoints[12],
          poses.keypoints[14],
          poses.keypoints[16]
        );

        if (
          leftLegRadAngle < degreesToRads(kneelAngle) &&
          rightLegRadAngle < degreesToRads(kneelAngle)
        ) {
          console.log("KNEELING");
          color = "pink";
          console.log(poses.keypoints);
        }

        // // Palms Together
        // let handDistance = calculateDistance(
        //   poses.keypoints[10],
        //   poses.keypoints[9]
        // );
        // console.log(handDistance);
        // if (handDistance <= prayHandDistance) {
        //   console.log("Palms together");
        //   color = "red";
        // }

        drawKeypoints(poses.keypoints, 0.01, ctx, 1, color);
        drawSkeleton(poses.keypoints, 0.55, ctx, 1, color);
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
