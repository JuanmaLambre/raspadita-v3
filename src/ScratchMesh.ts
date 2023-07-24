import * as THREE from "three";
import { BrushCurve } from "./BrushCurve";
import { ThickLineBrush } from "./brushes/ThickLineBrush";

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  material: THREE.MeshBasicMaterial;

  private renderer: THREE.WebGLRenderer;
  private alphaScene: THREE.Scene;
  private alphaCamera: THREE.OrthographicCamera;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number = 2) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true });
    super(geometry, material);

    this.renderer = renderer;
    this.material = material;
    this.width = width;
    this.height = height;
    this.name = "scratch";

    this.alphaCamera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 10);
    this.alphaCamera.position.set(0, 0, 1);

    this.generateAlphaMap();
  }

  private generateAlphaMap() {
    this.material?.alphaMap?.dispose();

    this.generateAlphaScene();

    this.material.alphaMap = this.renderAlphaTexture();
    this.material.needsUpdate = true;
  }

  private generateAlphaScene() {
    if (this.alphaScene) {
      this.alphaScene.userData.disposables?.forEach((obj: any) => obj.dispose?.());
    }

    this.alphaScene = new THREE.Scene();

    // Draw transparent stuff in black
    const { random } = Math;
    const brushCurve = new BrushCurve(new ThickLineBrush(this.width / 8));
    brushCurve.addPoint(new THREE.Vector2((random() - 0.5) * this.width, (random() - 0.5) * this.height));
    brushCurve.addPoint(new THREE.Vector2((random() - 0.5) * this.width, (random() - 0.5) * this.height));
    brushCurve.addPoint(new THREE.Vector2((random() - 0.5) * this.width, (random() - 0.5) * this.height));
    const holeGeom = brushCurve.buildGeometry();
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x0 });
    this.alphaScene.add(new THREE.Mesh(holeGeom, holeMat));

    this.alphaScene.userData.disposables = [holeGeom, holeMat];
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
}
