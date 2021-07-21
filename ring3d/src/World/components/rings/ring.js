import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel.js';
import { Group, MathUtils, CylinderBufferGeometry, MeshStandardMaterial, Mesh } from 'three';
import { Vector3 } from 'three';

function coordsToAngle(a, b) {
  let theta = Math.atan(b / a);

  if(a < 0) {
    theta += Math.PI;
  }

  return theta
}

async function loadGroup() {

  const group = new Group();

  group.update = (joints) => {

    const alpha = 0.6; // scalar between 0 and 1 controlling position of ring along finger. 0=base of finger, 1=first joint.
    let c = new Vector3();
    let baseJoint = new Vector3(joints[13].x, joints[13].y, joints[13].z);
    let fingerJoint = new Vector3(joints[14].x, joints[14].y, joints[14].z);
    c.addVectors(baseJoint.multiplyScalar(1-alpha), fingerJoint.multiplyScalar(alpha));
    let k = new Vector3();
    k.subVectors(joints[17], joints[9]);
    let l = new Vector3();
    l.subVectors(joints[14], joints[13]);

    const theta_x = coordsToAngle(l.y, l.z);
    const theta_y = coordsToAngle(k.x, k.z);
    const theta_z = coordsToAngle(l.y, l.x);

    group.position.set(c.x, c.y, c.z);

    const beta = 45/10000;
    const scale_const = 0;
    const scale = c.z * beta + scale_const
    group.scale.set(scale, scale, scale);


    group.rotation.x = Math.PI + theta_x;
    group.rotation.y = theta_y;
    group.rotation.z = theta_z;

  }

  const geometry = new CylinderBufferGeometry(1, 1, 4, 16);
  const material = new MeshStandardMaterial({ color: 'gray' });
  const cylinder = new Mesh(geometry, material);

  const loader = new GLTFLoader();
  
  const ringData = await loader.loadAsync('ring.glb');

  const ring = setupModel(ringData).model;

  ring.scale.set(1.15, 1.15, 1.15);

  ring.position.z = 1.25;

  ring.rotation.x = 0;

  cylinder.renderOrder = Number.MIN_SAFE_INTEGER;
  cylinder.material.colorWrite = false;

  group.add(ring, cylinder);

  return group;
}

export { loadGroup };