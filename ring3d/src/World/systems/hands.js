import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { Matrix3, Vector3 } from 'three';
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from '@mediapipe/drawing_utils';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class MediaPipeHands {
  constructor(camera, videoElement, canvas, callback) {
    this.camera = camera
    this.videoElement = videoElement;
    this.canvas = canvas;
    this.callback = callback;

    const hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
      selfieMode: true
    });

    hands.onResults((results) => {
      //draw annotations 
      // const canvasCtx = document.querySelector("#drawingCanvas").getContext('2d');
      // canvasCtx.save();
      // canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // canvasCtx.drawImage(
      //     results.image, 0, 0, this.canvas.width, this.canvas.height);
      // if (results.multiHandLandmarks) {
      //   for (const landmarks of results.multiHandLandmarks) {
      //     drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
      //                   {color: '#00FF00', lineWidth: 5});
      //     drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      //   }
      // }
      // canvasCtx.restore();

      if (results.multiHandLandmarks) {
        const processedJoints = this.processJoints(results.multiHandLandmarks[0])
        this.callback(processedJoints);
      }
    });

    const mediaCamera = new Camera(videoElement, {
      onFrame: async () => {
        // await sleep(5000);
        await hands.send({image: videoElement});
      },
    });

    mediaCamera.start();
  }

  processJoints(joints) {
    const vw = this.videoElement.videoWidth;
    const vh = this.videoElement.videoHeight;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const r = vw / vh;
    let M = new Matrix3();
    M.set(2*r*ch/cw, 0, 0, 0, -2, 0, 0, 0, 2*r*ch/cw);
    const b = new Vector3(-r*ch/cw, 1, -r*ch/cw);
    let result = [];
    for(const joint of joints) {
      let v = new Vector3(joint.x, joint.y, joint.z);
      v.applyMatrix3(M);
      v.addVectors(v, b);
      v.unproject(this.camera);
      result.push(v)
    }
    return result;
  }
}

export { MediaPipeHands }