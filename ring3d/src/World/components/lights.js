import { AmbientLight, DirectionalLight } from 'three';

function createLights() {
  const mainLight = new DirectionalLight('white', 5);
  const ambientLight = new AmbientLight('white', 2);

  ambientLight.position.set(1, 1, 1);

  return { ambientLight, mainLight }
}

export { createLights };