import * as THREE from "three";
import { Brush } from "./Brush";

export class ThickLineBrush extends Brush {
  thickness: number;

  constructor(canvasW: number, canvasH: number, thickness: number) {
    super(canvasW, canvasH);
    this.thickness = thickness;
  }

  paintAt(data: Uint8Array, from: THREE.Vector2, to: THREE.Vector2): void {
    const tangent = to.clone().sub(from);
    const length = tangent.length();

    if (length == 0) return;

    const normal = new THREE.Vector2(-tangent.y, tangent.x).setLength(this.thickness / 2);
    const a = from.clone().add(normal);
    const b = from.clone().sub(normal);
    const c = to.clone().add(normal);
    const d = to.clone().sub(normal);

    const { min, max, floor } = Math;
    const minX = max(0, min(a.x, b.x, c.x, d.x));
    const maxX = min(this.canvasWidth - 1, max(a.x, b.x, c.x, d.x));
    const minY = max(0, min(a.y, b.y, c.y, d.y));
    const maxY = min(this.canvasHeight - 1, max(a.y, b.y, c.y, d.y));

    const point = new THREE.Vector2();
    for (let x = floor(minX); x <= maxX; x++) {
      for (let y = floor(minY); y <= maxY; y++) {
        point.set(x, y);
        if (this.distanceToLine(point, a, b) > length) continue;
        if (this.distanceToLine(point, c, d) > length) continue;
        if (this.distanceToLine(point, a, c) > this.thickness) continue;
        if (this.distanceToLine(point, b, d) > this.thickness) continue;

        const idx = (x + y * this.canvasWidth) * this.pxDepth;
        for (let i = 0; i < this.pxDepth; i++) data[idx + i] = 0;
      }
    }
  }

  private distanceToLine(point: THREE.Vector2, p1: THREE.Vector2, p2: THREE.Vector2): number {
    // Source: https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
    if (p1.distanceToSquared(p2) == 0) return;

    const { x: x0, y: y0 } = point;
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;

    const numerator = Math.abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1));
    const denom = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return numerator / denom;
  }
}
