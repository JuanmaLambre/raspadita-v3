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
  color: 0xffffff,
};

const INIT_SCRATCH_PERCENTAGE = 0.05;

export class ScratchMesh extends THREE.Mesh {
  readonly width: number;
  readonly height: number;

  material: THREE.MeshBasicMaterial;

  private textureGenerator: AlphaTextureGenerator;
  private animation?: ScratchAnimation;

  constructor(opts: ScratchMeshOpts) {
    var { pxWidth, pxHeight, color } = { ...defaultOpts, ...opts };
    const aspect = pxWidth / pxHeight;
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const textureGenerator = new AlphaTextureGenerator(pxWidth, pxHeight);

    const alphaMap = textureGenerator.texture;
    const material = new THREE.MeshBasicMaterial({ color, alphaMap, transparent: true });

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

  setTexture(url: string, callback?: () => void) {
    this.material.color = new THREE.Color(0xffffff);

    new THREE.TextureLoader().load(url, (textureMap) => {
      this.material.map = textureMap;
      this.material.needsUpdate = true;
      callback?.();
    });
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
