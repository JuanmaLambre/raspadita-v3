import * as THREE from "three";
import { AlphaTextureGenerator } from "./AlphaTextureGenerator";

export type ScratchMeshOpts = {
  pxWidth: number;
  pxHeight: number;
  color?: THREE.ColorRepresentation;
};

const defaultOpts: Partial<ScratchMeshOpts> = {
  color: 0x303080,
};

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  material: THREE.Material;

  private textureGenerator: AlphaTextureGenerator;

  constructor(opts: ScratchMeshOpts) {
    var { pxWidth, pxHeight, color } = { ...defaultOpts, ...opts };
    const aspect = pxWidth / pxHeight;
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const textureGenerator = new AlphaTextureGenerator(pxWidth, pxHeight);

    // const gradToRad = Math.PI / 180;
    // const unitToPx = pxWidth / (2 * aspect);
    // const material = new TinMaterial({
    //   width: pxWidth,
    //   height: pxHeight,
    //   length: 0.7 * unitToPx,
    //   angle: 330 * gradToRad,
    //   offset: -0.1 * unitToPx,
    //   color1: 0x777777,
    //   color2: 0x656565,
    //   alphaMap: textureGenerator.texture,
    // });

    const material = new THREE.MeshBasicMaterial({ color, alphaMap: textureGenerator.texture, transparent: true });

    super(geometry, material);

    this.material = material;
    this.textureGenerator = textureGenerator;
    this.width = pxWidth;
    this.height = pxHeight;
    this.name = "scratch-mesh";
  }

  get painted(): number {
    return this.textureGenerator.painted;
  }

  /** Cartesian-oriented coordinates */
  scratch(from: THREE.Vector2, to: THREE.Vector2) {
    this.textureGenerator.scratch(from.round(), to.round());
  }

  reveal() {
    this.visible = false;
  }
}
