import * as THREE from "three";
import { CircleBrush } from "../brushes/CircleBrush";
import { Brush } from "../brushes/Brush";

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

    this.brush = new CircleBrush(this.width, this.height, 10);
  }

  /** Coordinates are cartesian-oriented (x+ axis points right, y+ axis points up) */
  scratchAt(pixelX: number, pixelY: number) {
    this.brush.paintAt(this.data, pixelX, pixelY);
    this.texture.needsUpdate = true;
  }

  private getGreenIndex(x: number, y: number): number {
    return (x + y * this.width) * 4 + 1;
  }
}
