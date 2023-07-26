import * as THREE from "three";

export type ScratchEvent = {
  from: THREE.Vector2; // In cartesian-pixel coords
  to: THREE.Vector2; // In cartesian-pixel coords
};
