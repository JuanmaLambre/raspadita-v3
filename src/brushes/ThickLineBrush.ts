import * as THREE from "three";
import { Brush } from "./Brush";

export class ThickLineBrush extends Brush {
  thickness: number;

  constructor(thickness: number) {
    super();
    this.thickness = thickness;
  }

  getStroke(p0: THREE.Vector2, p1: THREE.Vector2): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    const tangent = p1.clone().sub(p0);
    if (tangent.length() == 0) return geometry;

    const normal = new THREE.Vector2(-tangent.y, tangent.x).setLength(this.thickness / 2);

    const a = p0.clone().add(normal);
    const b = p0.clone().sub(normal);
    const c = p1.clone().add(normal);
    const d = p1.clone().sub(normal);

    const vertices = new Float32Array([a.x, a.y, 0, b.x, b.y, 0, c.x, c.y, 0, c.x, c.y, 0, b.x, b.y, 0, d.x, d.y, 0]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    return geometry;
  }
}
