import * as THREE from "three";
import { Brush, NumberArray } from "./Brush";

export class ThickLineBrush extends Brush {
  thickness: number;

  constructor(canvasWidth: number, canvasHeight: number, thickness: number) {
    super(canvasWidth, canvasHeight);
    this.thickness = thickness;
  }

  paintAt(data: NumberArray, x: number, y: number) {
    throw Error("Missing implementation");
  }
}
