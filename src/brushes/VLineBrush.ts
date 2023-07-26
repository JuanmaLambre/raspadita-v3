import * as THREE from "three";
import { Brush, NumberArray } from "./Brush";

export class VLineBrush extends Brush {
  height: number;
  width: number;

  constructor(canvasWidth: number, canvasHeight: number, width: number, height: number) {
    super(canvasWidth, canvasHeight);
    this.height = height;
    this.width = width;
  }

  paintAt(data: NumberArray, x: number, y: number) {
    throw Error("Missing implementation");
  }
}
