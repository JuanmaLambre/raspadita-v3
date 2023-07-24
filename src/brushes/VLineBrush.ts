import * as THREE from "three";
import { Brush } from "./Brush";

export class VLineBrush extends Brush {
  height: number;

  constructor(height: number) {
    super();
    this.height = height;
  }

  getStroke(p0: THREE.Vector2, p1: THREE.Vector2): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    const a = p0.clone().add(new THREE.Vector2(0, this.height / 2));
    const b = p0.clone().sub(new THREE.Vector2(0, this.height / 2));
    const c = p1.clone().add(new THREE.Vector2(0, this.height / 2));
    const d = p1.clone().sub(new THREE.Vector2(0, this.height / 2));

    const vertices = new Float32Array([a.x, a.y, 0, b.x, b.y, 0, c.x, c.y, 0, c.x, c.y, 0, b.x, b.y, 0, d.x, d.y, 0]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    return geometry;
  }
}
