export type DataArrayType = Uint8Array;

export abstract class Brush {
  pxDepth: number = 4;
  canvasWidth: number;
  canvasHeight: number;

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  abstract paintAt(data: DataArrayType, from: THREE.Vector2, to: THREE.Vector2): void;
}
