import * as THREE from "three";
import { Brush } from "../brushes/Brush";
import { ThickLineBrush } from "../brushes/ThickLineBrush";

export class AlphaTextureGenerator {
  brush: Brush;
  readonly texture: THREE.DataTexture;

  private data: Uint8Array;
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    // Apparently alphaMap only interpretates the green channel...?
    this.data = new Uint8Array(width * height * 4).fill(255);

    this.texture = new THREE.DataTexture(this.data, width, height, THREE.RGBAFormat);
    this.texture.needsUpdate = true;

    this.brush = new ThickLineBrush(this.width, this.height);
  }

  /** Coordinates are cartesian-oriented (x+ axis points right, y+ axis points up) */
  scratch(from: THREE.Vector2, to: THREE.Vector2) {
    this.brush.paintAt(this.data, from, to);
    this.texture.needsUpdate = true;
  }

  private getGreenIndex(x: number, y: number): number {
    return (x + y * this.width) * 4 + 1;
  }

  private debugScratch() {
    const rand = Math.random;
    // const from = new THREE.Vector2(rand() * this.width, rand() * this.height);
    const from = new THREE.Vector2(0, 0);
    const to = new THREE.Vector2(rand() * this.width, rand() * this.height);
    this.scratch(from.round(), to.round());
  }
}
