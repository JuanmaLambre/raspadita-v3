import * as THREE from "three";
import { BrushCurve } from "../brushes/BrushCurve";

export class AlphaTextureGenerator {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material: THREE.MeshBasicMaterial;

  constructor(renderer: THREE.WebGLRenderer, width: number, height: number) {
    this.renderer = renderer;

    this.material = new THREE.MeshBasicMaterial({ color: 0x0 });
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0.01, 10);
    this.camera.position.set(0, 0, 1);
  }

  updateScene(curves: BrushCurve[]) {
    this.scene.clear();

    curves.forEach((curve) => {
      const mesh = new THREE.Mesh(curve.geometry, this.material);
      this.scene.add(mesh);
    });
  }

  renderTexture(): THREE.Texture {
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

    const target = new THREE.WebGLRenderTarget(1024, 1024, targetOpts);
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    this.renderer.setRenderTarget(oldTarget);
    this.renderer.setClearColor(oldClearColor, oldAlpha);

    return target.texture;
  }
}
