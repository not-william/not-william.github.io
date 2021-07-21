import { CylinderBufferGeometry, Mesh, MeshStandardMaterial } from 'three';

function createCylinder(position=[0, 0, 0]) {
  // create a geometry
  const geometry = new CylinderBufferGeometry(0.03, 0.03, 0.1, 16);

  // create a default (white) Basic material
  const material = new MeshStandardMaterial({ color: 'gray' });

  // create a Mesh containing the geometry and material
  const cylinder = new Mesh(geometry, material);

  cylinder.position.set(position[0], position[1], position[2])
  cylinder.rotation.set(0, 0, 0.1);
  return cylinder;
}

export { createCylinder };