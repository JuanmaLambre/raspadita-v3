import * as THREE from "three";
import { BrushCurve } from "../brushes/BrushCurve";
import { ThickLineBrush } from "../brushes/ThickLineBrush";
import { AlphaTextureGenerator } from "./AlphaTextureGenerator";

const BRUSH_THICKNESS = 0.07;

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  tinMaterial: THREE.MeshBasicMaterial;

  private brushCurves: BrushCurve[] = [];
  private currentScratch: BrushCurve;
  private textureGenerator: AlphaTextureGenerator;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number = 2) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true });
    super(geometry, material);

    this.tinMaterial = material;
    this.width = width;
    this.height = height;
    this.name = "scratch";
    this.textureGenerator = new AlphaTextureGenerator(renderer, width, height);

    this.updateAlphaMap();
  }

  startScratch() {
    this.currentScratch = new BrushCurve(new ThickLineBrush(BRUSH_THICKNESS));
    this.brushCurves.push(this.currentScratch);
    this.updateAlphaMap();
  }

  stopScratch() {
    this.currentScratch = undefined;
  }

  addScratchPoint(point: THREE.Vector2) {
    if (!this.currentScratch) return;

    this.currentScratch.addPoint(point);
    this.updateAlphaMap();
  }

  private updateAlphaMap() {
    this.textureGenerator.updateScene(this.brushCurves);

    this.tinMaterial?.alphaMap?.dispose();
    this.tinMaterial.alphaMap = this.textureGenerator.renderTexture();
    this.tinMaterial.needsUpdate = true;
  }

  private debugGenerateBrushCurve() {
    const { random } = Math;

    this.startScratch();

    for (let i = 0; i < 3; i++) {
      const x = (random() - 0.5) * this.width;
      const y = (random() - 0.5) * this.height;
      this.addScratchPoint(new THREE.Vector2(x, y));
    }

    this.stopScratch();
  }
}
