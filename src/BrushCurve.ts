import * as THREE from "three";
import { VLineBrush } from "./brushes/VLineBrush";
import { Brush } from "./brushes/Brush";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export class BrushCurve {
  brush: Brush;

  private points: THREE.Vector2[] = [];
  private object: THREE.Object3D;
  private disposables: any[] = [];

  constructor(brush: Brush = new VLineBrush(0.2)) {
    this.brush = brush;
  }

  addPoint(point: THREE.Vector2) {
    this.points.push(point.clone());
  }

  clear() {
    this.points.length = 0;
  }

  buildGeometry(): THREE.BufferGeometry {
    const geometries: THREE.BufferGeometry[] = [];

    for (let i = 1; i < this.points.length; i++) {
      const p0 = this.points[i - 1];
      const p1 = this.points[i];
      geometries.push(this.brush.getStroke(p0, p1));
    }

    const result = mergeBufferGeometries(geometries, false);
    geometries.forEach((geom) => geom.dispose());

    return result;
  }
}
