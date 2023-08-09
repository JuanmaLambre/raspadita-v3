import * as THREE from "three";
import { AlphaTextureGenerator } from "./AlphaTextureGenerator";
import { TinMaterial } from "../materials/TinMaterial";

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  tinMaterial: TinMaterial;

  private textureGenerator: AlphaTextureGenerator;

  constructor(pxWidth: number, pxHeight: number) {
    const aspect = pxWidth / pxHeight;
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const textureGenerator = new AlphaTextureGenerator(pxWidth, pxHeight);

    const gradToRad = Math.PI / 180;
    const unitToPx = pxWidth / (2 * aspect);

    const material = new TinMaterial({
      width: pxWidth,
      height: pxHeight,
      length: 0.7 * unitToPx,
      angle: 330 * gradToRad,
      offset: -0.1 * unitToPx,
      color1: 0x666666,
      color2: 0x505050,
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
