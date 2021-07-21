import { setupMediaPipe } from './World/systems/hands.js';
import { World } from './World/World.js';

// create the main function
async function main() {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // Create an instance of the World app
  const world = new World(container);

  await world.init();

  // Start the animation loop
  world.start();

  var video = document.querySelector("#videoElement");

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }

  world.trackHands(video);
}

// call main to start the app
main().catch((err) => {
  console.error(err);
});