import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true});
  renderer.setClearAlpha(0.0);
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };