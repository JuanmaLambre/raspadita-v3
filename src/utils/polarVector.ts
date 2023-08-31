import * as THREE from "three";

export function polarVector(angle: number, length = 1): THREE.Vector2 {
  const x = length * Math.cos(angle);
  const y = length * Math.sin(angle);
  return new THREE.Vector2(x, y);
}
