import { PMREMGenerator, sRGBEncoding } from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

function applyHDR(renderer, scene) {
  const pmremGenerator = new PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  let envMap;

  renderer.outputEncoding = sRGBEncoding;
  new RGBELoader().load(`./Living Room.hdr`, texture => {
    envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  });
}

export { applyHDR };