import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { loadGroup } from './components/rings/ring.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { MediaPipeHands } from './systems/hands.js';
import { applyHDR } from './systems/hdr.js';

// import { Stats } from 'stats.js';

let camera;
let renderer;
let scene;
let loop;
let hands;

class World {
  constructor(container) {
    this.container = container;
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const { mainLight, ambientLight } = createLights();

    scene.add(mainLight, ambientLight);

    applyHDR(renderer, scene);

    const resizer = new Resizer(container, camera, renderer);

    // stats = new Stats();
    // stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild( stats.dom );
  }

  async init() {
    this.ringGroup = await loadGroup();
    
    scene.add(this.ringGroup);
  }

  render() {
    // draw a single frame
    // renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }

  trackHands(videoElement) {
    hands = new MediaPipeHands(camera, videoElement, this.container.children[0], this.ringGroup.update);
  }
}

export { World };