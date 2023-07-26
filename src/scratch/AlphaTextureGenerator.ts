import * as THREE from "three";

export class AlphaTextureGenerator {
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
  }

  /** Coordinates are cartesian-oriented (x+ axis points right, y+ axis points up) */
  scratchAt(pixelX: number, pixelY: number) {
    const greenIdx = this.getGreenIndex(pixelX, pixelY);
    this.data[greenIdx] = 0;
    this.texture.needsUpdate = true;
  }

  private getGreenIndex(x: number, y: number): number {
    return (x + y * this.width) * 4 + 1;
  }

  debugScratch() {
    const { floor } = Math;

    for (let x = floor((2 * this.width) / 3); x < this.width; x++) {
      for (let y = floor(this.height / 3); y < (2 * this.height) / 3; y++) {
        this.scratchAt(x, y);
      }
    }

    this.texture.needsUpdate = true;
  }
}
