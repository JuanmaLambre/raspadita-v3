import * as THREE from "three";
import { AlphaTextureGenerator } from "./AlphaTextureGenerator";
import { ScratchAnimation } from "./ScratchAnimation";
import { polarVector } from "../utils/polarVector";

export type ScratchMeshOpts = {
  pxWidth: number;
  pxHeight: number;
  color?: THREE.ColorRepresentation;
};

const defaultOpts: Partial<ScratchMeshOpts> = {
  color: 0x303080,
};

const INIT_SCRATCH_PERCENTAGE = 0.05;

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  material: THREE.Material;

  private textureGenerator: AlphaTextureGenerator;
  private animation?: ScratchAnimation;

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

  get isPlayingAnimation(): boolean {
    return !!this.animation?.isPlaying;
  }

  update() {
    if (!this.animation || !this.animation.isPlaying) return;

    const [from, to] = this.animation.getStepScratch();
    this.scratch(from, to);

    this.animation.step();
  }

  /** Cartesian-oriented coordinates */
  scratch(from: THREE.Vector2, to: THREE.Vector2) {
    this.textureGenerator.scratch(from.round(), to.round());
  }

  reveal() {
    this.visible = false;
  }

  executeScratchAnimation(from: THREE.Vector2) {
    // Calculate the animation direction
    const center = new THREE.Vector2(this.width / 2, this.height / 2).round();
    if (from.x > this.width / 2) {
      if (from.y > this.height / 2) var direction = center.clone().sub(new THREE.Vector2(this.width, this.height));
      else direction = center.clone().sub(new THREE.Vector2(this.width, 0));
    } else {
      if (from.y > this.height / 2) direction = center.clone().sub(new THREE.Vector2(0, this.height));
      else direction = center.clone();
    }

    // Set `to` position by calculating how long the animation brush must be to cover INIT_SCRATCH_PERCENTAGE of canvas
    direction.setLength(((this.width * this.height) / this.textureGenerator.brush.thickness) * INIT_SCRATCH_PERCENTAGE);
    const to = from.clone().add(direction);

    this.animation = new ScratchAnimation(from, to);
    this.animation.play();
  }

  stopScratchAnimation() {
    this.animation?.stop();
  }
}
