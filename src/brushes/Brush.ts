export type NumberArray = Uint8Array;

export abstract class Brush {
  pxDepth: number = 4;
  canvasWidth: number;
  canvasHeight: number;

  constructor(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  abstract paintAt(data: NumberArray, x: number, y: number): void;
}
