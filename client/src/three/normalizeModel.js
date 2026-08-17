import * as THREE from 'three';

/**
 * Clone a GLTF scene and normalize it: scale so its height equals `targetHeight`,
 * center it on X/Z and sit its base at y=0. Returns the ready-to-use scene.
 * Bags in this repo have wildly different native scales (0.4 to 327 units),
 * so every model goes through this before it is placed in the world.
 */
export function normalizeModel(scene, targetHeight = 1) {
  const s = scene.clone();

  const box = new THREE.Box3().setFromObject(s);
  const size = box.getSize(new THREE.Vector3());
  const scale = size.y > 0 ? targetHeight / size.y : 1;
  s.scale.set(scale, scale, scale);

  const scaledBox = new THREE.Box3().setFromObject(s);
  const center = scaledBox.getCenter(new THREE.Vector3());
  s.position.x -= center.x;
  s.position.y -= scaledBox.min.y; // sit on y=0
  s.position.z -= center.z;

  return s;
}

/** Compute a bounding box size helper (for lazy callers). */
export function modelSize(scene) {
  const box = new THREE.Box3().setFromObject(scene);
  return box.getSize(new THREE.Vector3());
}
