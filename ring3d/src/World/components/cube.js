import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from 'three';
import { MathUtils } from 'three';

function createCube(position=[0, 0, 0]) {
  // create a geometry
  const geometry = new BoxBufferGeometry(2, 2, 2);

  // create a default (white) Basic material
  const material = new MeshStandardMaterial({ color: 'purple' });

  // create a Mesh containing the geometry and material
  const cube = new Mesh(geometry, material);

  cube.position.set(position[0], position[1], position[2])
  cube.rotation.set(-0.5, -0.1, 0.8);

  const rotationPerSecond = MathUtils.degToRad(15);

  cube.tick = (delta) => {
    cube.rotation.x += rotationPerSecond * delta;
    cube.rotation.y += rotationPerSecond * delta;
    cube.rotation.z += rotationPerSecond * delta;
  }

  return cube;
}

export { createCube };