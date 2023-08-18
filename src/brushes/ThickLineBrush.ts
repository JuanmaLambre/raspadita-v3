import * as THREE from "three";
import $ from "jquery";
import { Brush } from "./Brush";

export class ThickLineBrush extends Brush {
  thickness: number;

  constructor(canvasW: number, canvasH: number, thickness: number = 20) {
    super(canvasW, canvasH);
    this.thickness = thickness;

    this.setDebugSpinner();
  }

  /** Returns amount of pixels painted, without counting already painted pixels */
  paintAt(data: Uint8Array, from: THREE.Vector2, to: THREE.Vector2): number {
    let pixelsPainted = 0;
    const tangent = to.clone().sub(from);
    const length = tangent.length();

    if (length == 0) return 0;

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

    // Iterate through pixels
    const point = new THREE.Vector2();
    for (let x = floor(minX); x <= maxX; x++) {
      for (let y = floor(minY); y <= maxY; y++) {
        point.set(x, y);

        // Check if pixel is inside brushed surface
        if (this.distanceToLine(point, a, b) > length) continue;
        if (this.distanceToLine(point, c, d) > length) continue;
        if (this.distanceToLine(point, a, c) > this.thickness) continue;
        if (this.distanceToLine(point, b, d) > this.thickness) continue;

        // Get pixel index & check if it needs to be painted
        const idx = (x + y * this.canvasWidth) * this.pxDepth;
        if (data[idx] == 0) continue;

        // Paint pixels
        pixelsPainted++;
        for (let i = 0; i < this.pxDepth; i++) data[idx + i] = 0;
      }
    }

    return pixelsPainted;
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

  private setDebugSpinner() {
    const spinner = $("#thickness-input")[0] as HTMLInputElement;
    if (!spinner) return;

    spinner.value = this.thickness.toString();

    spinner.addEventListener("input", (ev) => {
      this.thickness = parseInt(spinner.value);
    });
  }
}
