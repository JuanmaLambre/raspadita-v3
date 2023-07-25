import * as THREE from "three";
import { BrushCurve } from "./BrushCurve";
import { ThickLineBrush } from "./brushes/ThickLineBrush";

const BRUSH_THICKNESS = 0.07;

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  tinMaterial: THREE.MeshBasicMaterial;

  private renderer: THREE.WebGLRenderer;
  private alphaScene: THREE.Scene;
  private alphaCamera: THREE.OrthographicCamera;
  private brushCurves: BrushCurve[] = [];
  private currentScratch: BrushCurve;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number = 2) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true });
    super(geometry, material);

    this.renderer = renderer;
    this.tinMaterial = material;
    this.width = width;
    this.height = height;
    this.name = "scratch";

    this.buildAlphaScene();
    this.updateAlphaMap();
  }

  startScratch() {
    this.currentScratch = new BrushCurve(new ThickLineBrush(BRUSH_THICKNESS));
    this.brushCurves.push(this.currentScratch);
    this.updateAlphaScene();
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
    this.tinMaterial?.alphaMap?.dispose();

    this.tinMaterial.alphaMap = this.renderAlphaTexture();
    this.tinMaterial.needsUpdate = true;
  }

  private buildAlphaScene() {
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0 });

    this.alphaScene = new THREE.Scene();
    this.alphaScene.userData.material = holeMat;

    this.alphaCamera = new THREE.OrthographicCamera(
      -this.width / 2,
      this.width / 2,
      this.height / 2,
      -this.height / 2,
      0.01,
      10
    );

    this.alphaCamera.position.set(0, 0, 1);

    this.updateAlphaScene();
  }

  private updateAlphaScene() {
    this.alphaScene.clear();
    const holeMat = this.alphaScene.userData.material as THREE.MeshBasicMaterial;

    this.brushCurves.forEach((curve) => {
      const mesh = new THREE.Mesh(curve.geometry, holeMat);
      this.alphaScene.add(mesh);
    });
  }

  private renderAlphaTexture() {
    const oldTarget = this.renderer.getRenderTarget();
    const oldClearColor = new THREE.Color();
    const oldAlpha = this.renderer.getClearAlpha();
    this.renderer.getClearColor(oldClearColor);

    this.renderer.setClearColor(0xffffff);

    let targetOpts: THREE.WebGLRenderTargetOptions = {
      minFilter: THREE.LinearFilter, // Important as we want to sample square pixels
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType, // Important as we need precise coordinates (not ints)
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
    };

    const target = new THREE.WebGLRenderTarget(512, 512, targetOpts);
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.alphaScene, this.alphaCamera);

    this.renderer.setRenderTarget(oldTarget);
    this.renderer.setClearColor(oldClearColor, oldAlpha);

    return target.texture;
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
