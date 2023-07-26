import * as THREE from "three";
import { AlphaTextureGenerator } from "./AlphaTextureGenerator";

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  tinMaterial: THREE.MeshBasicMaterial;

  private textureGenerator: AlphaTextureGenerator;

  constructor(pxWidth: number, pxHeight: number) {
    const aspect = pxWidth / pxHeight;
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const textureGenerator = new AlphaTextureGenerator(pxWidth, pxHeight);
    const material = new THREE.MeshBasicMaterial({
      color: 0x666666,
      transparent: true,
      alphaMap: textureGenerator.texture,
    });

    super(geometry, material);

    this.tinMaterial = material;
    this.textureGenerator = textureGenerator;
    this.width = pxWidth;
    this.height = pxHeight;
    this.name = "scratch-mesh";
  }

  /** Cartesian-oriented coordinates */
  scratch(from: THREE.Vector2, to: THREE.Vector2) {
    this.textureGenerator.scratch(from.round(), to.round());
  }
}
