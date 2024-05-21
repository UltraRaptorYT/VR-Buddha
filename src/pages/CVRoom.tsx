import * as poseDetection from "@tensorflow-models/pose-detection";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { MutableRefObject, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "@/lib/pose_utils";
import { degreesToRads } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { RoomType } from "@/types";

export default function CVRoom() {
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [state, setState] = useState<boolean>(false);
  const [isKneeling, setIsKneeling] = useState<boolean>(false);
  const { room_id } = useParams();
  let height = document.body.clientHeight || 699;
  let width = (height * 4) / 3;
  let kneelAngle = 105;
  let standingAngle = 180;
  let standingAngleDiff = 20;
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const virtualBGRef = useRef<HTMLImageElement | null>(null);
  let detector: poseDetection.PoseDetector;
  let bodypix: bodyPix.BodyPix;

  async function loadModels() {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );

    bodypix = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2,
    });

    console.log("Running Models");
    setInterval(async () => {
      await runModels();
    }, 100);
  }

  async function runModels() {
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

      const segmentation = await bodypix.segmentPerson(video, {
        flipHorizontal: false,
        internalResolution: "medium",
        segmentationThreshold: 0.5,
      });

      const poses = await detector.estimatePoses(video);
      drawCanvas(
        segmentation,
        poses[0],
        video,
        videoWidth,
        videoHeight,
        canvasRef
      );
    }
  }

  type Coordinate = {
    x: number;
    y: number;
  };

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
    segmentation: bodyPix.SemanticPersonSegmentation,
    poses: poseDetection.Pose,
    video: HTMLVideoElement,
    videoWidth: number,
    videoHeight: number,
    canvas: MutableRefObject<HTMLCanvasElement | null>
  ) => {
    if (canvas.current && segmentation && poses && video) {
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
          console.log(poses.keypoints, manualMode);
          setIsKneeling(true);
        } else {
          setIsKneeling(false);
        }

        // Check Bowing
        let leftBodyRadAngle = cosineRule(
          poses.keypoints[5],
          poses.keypoints[11],
          poses.keypoints[13]
        );

        let rightBodyRadAngle = cosineRule(
          poses.keypoints[6],
          poses.keypoints[12],
          poses.keypoints[14]
        );

        if (
          leftBodyRadAngle <
            degreesToRads(standingAngle) - degreesToRads(standingAngleDiff) &&
          rightBodyRadAngle <
            degreesToRads(standingAngle) - degreesToRads(standingAngleDiff)
        ) {
          console.log("BOWING");
          color = "red";
          setIsKneeling(true);
        } else {
          setIsKneeling(false);
        }

        drawVirtualBackground(ctx, video, segmentation);

        drawKeypoints(poses.keypoints, 0.01, ctx, 1, color);
        drawSkeleton(poses.keypoints, 0.55, ctx, 1, color);
      }
    }
  };

  const drawVirtualBackground = (
    ctx: CanvasRenderingContext2D,
    video: HTMLVideoElement,
    segmentation: bodyPix.SemanticPersonSegmentation
  ) => {
    if (virtualBGRef.current) {
      ctx.drawImage(
        virtualBGRef.current,
        0,
        0,
        video.videoWidth,
        video.videoHeight
      );
    }
    const foregroundColor = { r: 0, g: 0, b: 0, a: 255 };
    const backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
    const mask = bodyPix.toMask(
      segmentation,
      foregroundColor,
      backgroundColor,
      false
    );
    ctx.putImageData(mask, 0, 0);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    ctx.globalCompositeOperation = "source-over";
  };

  useEffect(() => {
    if (isKneeling && !state) {
      updateState();
    }
  }, [isKneeling, state]);

  async function updateState() {
    console.log("UPDATING STATE", state, manualMode);
    if (!manualMode && !state) {
      let { error } = await supabase
        .from("vr-buddha-room")
        .update({ state: true })
        .eq("id", room_id);
      if (error) {
        console.error("Error", error);
      }
    } else {
      let { error } = await supabase
        .from("vr-buddha-room")
        .update({ state: false })
        .eq("id", room_id);
      if (error) {
        console.error("Error", error);
      }
    }
    return;
  }

  async function loadTF() {
    await tf.ready();
    await tf.setBackend("webgl");
    await loadModels();
  }

  async function getRoom() {
    let { data, error } = await supabase
      .from("vr-buddha-room")
      .select()
      .eq("id", room_id);
    if (error) {
      return console.error("Error");
    }
    return data;
  }

  async function addRoom() {
    let currentRoom = await getRoom();
    if (currentRoom && currentRoom.length == 0) {
      let { error } = await supabase
        .from("vr-buddha-room")
        .insert({ id: room_id })
        .select();
      if (error) {
        return console.error("Error");
      }
    }
    return console.log(`ROOM ${room_id} INSERTED`);
  }

  async function getManual() {
    let { data, error } = await supabase
      .from("vr-buddha-room")
      .select()
      .eq("id", room_id);
    if (error) {
      return console.error("Error");
    }
    console.log(data);
    if (data) {
      setManualMode((data[0] as RoomType).manual);
    }
  }

  async function getState() {
    let { data, error } = await supabase
      .from("vr-buddha-room")
      .select()
      .eq("id", room_id);
    if (error) {
      return console.error("Error");
    }
    if (!data) {
      return false;
    }

    console.log(data);
    if (data) {
      setState((data[0] as RoomType).state);
    }
  }

  useEffect(() => {
    loadTF();
    if (room_id) {
      addRoom();
      getManual();
      getState();
      let channel = supabase.channel(`vr_${room_id}`);
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vr-buddha-room" },
        (payload) => {
          console.log("Change received!", payload);
          getManual();
          getState();
        }
      );

      channel.subscribe();
      return () => {
        channel.unsubscribe();
      };
    }
  }, []);

  return (
    <div className="spaceBG h-full">
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
          // backgroundImage: "url(" + "/1.jpg" + ")",
        }}
      />
    </div>
  );
}
