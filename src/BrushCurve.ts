import * as THREE from "three";
import { VLineBrush } from "./brushes/VLineBrush";
import { Brush } from "./brushes/Brush";
import { mergeBufferAttributes, mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export class BrushCurve {
  brush: Brush;
  geometry: THREE.BufferGeometry = new THREE.BufferGeometry();

  private points: THREE.Vector2[] = [];

  constructor(brush: Brush = new VLineBrush(0.2)) {
    this.brush = brush;
  }

  addPoint(point: THREE.Vector2) {
    this.points.push(point.clone());

    // Update geometry with last pair of points
    if (this.points.length < 2) return;

    const lastTwo = this.points.slice(-2);
    const newPositions = this.brush.getStroke(lastTwo[0], lastTwo[1]).getAttribute("position") as THREE.BufferAttribute;
    const oldPosititions = this.geometry.getAttribute("position") as THREE.BufferAttribute;

    if (oldPosititions) var newAttribute = mergeBufferAttributes([oldPosititions, newPositions]);
    else newAttribute = newPositions;

    this.geometry.setAttribute("position", newAttribute);
  }

  clear() {
    this.points.length = 0;
  }
}
