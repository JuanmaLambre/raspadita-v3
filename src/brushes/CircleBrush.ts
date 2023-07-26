import { Brush, NumberArray } from "./Brush";

export class CircleBrush extends Brush {
  radius: number;

  constructor(canvasWidth: number, canvasHeight: number, radius: number) {
    super(canvasWidth, canvasHeight);
    this.radius = Math.round(radius);
  }

  paintAt(data: NumberArray, centerX: number, centerY: number) {
    for (let x = -this.radius; x <= this.radius; x++) {
      for (let y = -this.radius; y <= this.radius; y++) {
        if (0 > centerX + x || centerX + x >= this.canvasWidth) continue;
        if (0 > centerY + y || centerY + y >= this.canvasHeight) continue;

        if (Math.sqrt(x ** 2 + y ** 2) < this.radius) {
          const idx = (centerX + x + (centerY + y) * this.canvasWidth) * this.pxDepth;
          for (let i = 0; i < this.pxDepth; i++) data[idx + i] = 0;
        }
      }
    }
  }
}
