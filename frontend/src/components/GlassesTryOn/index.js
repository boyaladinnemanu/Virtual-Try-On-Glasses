import React, { useRef, useEffect, useState } from "react";
import { FaceMesh, FACEMESH_FACE_OVAL,FACEMESH_CONTOURS } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import "./index.css";

const GlassesTryOn = ({ imageUrl }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const faceMeshModelRef = useRef(null); // Use useRef for faceMeshModel
  const [glassesImage, setGlassesImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadGlassesImage = (url) => {
    setIsLoading(true);
    const img = new Image();
    img.src = url;

    img.onload = () => {
      setGlassesImage(img);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    if (imageUrl) {
      loadGlassesImage(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (!webcamRef.current || !webcamRef.current.video) return;

    const faceMeshModel = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMeshModelRef.current = faceMeshModel; // Store in ref for cross-scope use

    faceMeshModel.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshModel.onResults((results) => {
      if (!canvasRef.current || !webcamRef.current?.video || !glassesImage) return;

      const video = webcamRef.current.video;
      if (video.readyState !== 4) return;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        results.multiFaceLandmarks.forEach((landmarks) => {
          drawConnectors(ctx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#00FF00",
            lineWidth: 1,
          });

          const leftEyeOuter = landmarks[33];
          const rightEyeOuter = landmarks[263];
          const leftEyeInner = landmarks[133];
          const rightEyeInner = landmarks[362];
          const noseTip = landmarks[6];

          const leftEyeCenter = {
            x: (leftEyeOuter.x + leftEyeInner.x) / 2,
            y: (leftEyeOuter.y + leftEyeInner.y) / 2,
          };
          const rightEyeCenter = {
            x: (rightEyeOuter.x + rightEyeInner.x) / 2,
            y: (rightEyeOuter.y + rightEyeInner.y) / 2,
          };

          // Calculate angle for rotation (atan2 calculates angle from x-axis)
          const angle = Math.atan2(rightEyeCenter.y - leftEyeCenter.y, rightEyeCenter.x - leftEyeCenter.x);

          const eyeDistance =
            Math.hypot(rightEyeCenter.x - leftEyeCenter.x, rightEyeCenter.y - leftEyeCenter.y) *
            videoWidth;

          const glassesWidth = eyeDistance * 2.4;
          const glassesHeight = glassesWidth * (glassesImage.height / glassesImage.width);

          const glassesX =
            ((leftEyeCenter.x + rightEyeCenter.x) * videoWidth) / 2 - glassesWidth / 2;
          const glassesY =
            ((noseTip.y + leftEyeCenter.y) * videoHeight) / 2 - glassesHeight / 2;

          // Rotate glasses
          const rotateGlasses = (image, angle) => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;

            // Move the origin to the center of the image
            ctx.translate(image.width / 2, image.height / 2);
            ctx.rotate(angle); // Rotate by the angle
            ctx.drawImage(image, -image.width / 2, -image.height / 2); // Draw image at the new origin

            return canvas;
          };

          const rotatedGlassesCanvas = rotateGlasses(glassesImage, angle);
          ctx.drawImage(rotatedGlassesCanvas, glassesX, glassesY, glassesWidth, glassesHeight);
        });
      }
    });

    const startCamera = () => {
      if (webcamRef.current && webcamRef.current.video) {
        cameraRef.current = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (glassesImage && faceMeshModelRef.current && webcamRef.current?.video) {
              await faceMeshModelRef.current.send({ image: webcamRef.current.video });
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current.start();
      }
    };

    startCamera();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
      faceMeshModel.close();
    };
  }, [glassesImage]);

  const restartCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }

    setTimeout(() => {
      if (webcamRef.current && webcamRef.current.video) {
        cameraRef.current = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (glassesImage && faceMeshModelRef.current) {
              await faceMeshModelRef.current.send({ image: webcamRef.current.video });
            }
          },
          width: 640,
          height: 480,
        });
        cameraRef.current.start();
      }
    }, 2000);
  };

  return (
    <div className="try-on-container">
      <Webcam
        ref={webcamRef}
        className="webcam"
        videoConstraints={{
          facingMode: "user",
        }}
      />
      <canvas ref={canvasRef} className="overlay" />
      {isLoading && <div className="loading">Loading glasses...</div>}
    </div>
  );
};

export default GlassesTryOn;
