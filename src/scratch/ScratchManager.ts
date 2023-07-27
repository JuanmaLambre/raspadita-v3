import * as THREE from "three";
import { ScratchMesh } from "./ScratchMesh";
import { getScratchContent } from "../backend/getScratchContent";

const DEBUG_RENDER = false;

export class ScratchManager {
  readonly pxWidth: number; // In CSS pixels
  readonly pxHeight: number; // In CSS pixels
  readonly renderer: THREE.WebGLRenderer;

  public scratchMesh: ScratchMesh;

  private divElement: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private isScratched: boolean = false;

  private lastTouch: THREE.Vector2 = new THREE.Vector2();

  constructor(divElement: HTMLDivElement) {
    this.divElement = divElement;
    this.pxWidth = divElement.offsetWidth;
    this.pxHeight = divElement.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setSize(this.pxWidth, this.pxHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.divElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener("touchstart", this.onTouchStart.bind(this));
    this.renderer.domElement.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.renderer.domElement.addEventListener("touchend", this.onTouchEnd.bind(this));

    this.scratchMesh = new ScratchMesh(this.pxWidth, this.pxHeight);
    this.scene = new THREE.Scene();
    this.scene.add(this.scratchMesh);

    if (DEBUG_RENDER) {
      const axes = new THREE.AxesHelper(this.aspect);
      axes.position.set(0, 0, 0.01);
      this.scene.add(axes);
    }

    this.camera = new THREE.OrthographicCamera(-this.aspect, this.aspect, 1, -1, 0.001, 10);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera);
  }

  get aspect(): number {
    return this.pxWidth / this.pxHeight;
  }

  get scratched(): boolean {
    return this.isScratched;
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onScratchSelected() {
    this.isScratched = true;

    const id = Math.round(Math.random() * 10);
    getScratchContent(id).then((response) => console.log("RESPONSE:", response));
  }

  private onTouchStart(event: TouchEvent) {
    // Calculate touch coordinates relative to canvas in cartesian pixel coords
    const pixelCoordX = event.targetTouches[0].clientX - this.renderer.domElement.offsetLeft;
    const pixelCoordY = this.renderer.domElement.offsetTop - event.targetTouches[0].clientY + this.pxHeight;

    this.lastTouch.set(pixelCoordX, pixelCoordY);
  }

  private onTouchMove(event: TouchEvent) {
    if (!this.scratched) this.onScratchSelected();

    // Calculate touch coordinates relative to canvas in cartesian pixel coords
    const pixelCoordX = event.targetTouches[0].clientX - this.renderer.domElement.offsetLeft;
    const pixelCoordY = this.renderer.domElement.offsetTop - event.targetTouches[0].clientY + this.pxHeight;
    const point = new THREE.Vector2(pixelCoordX, pixelCoordY);

    // Do scratch
    this.scratchMesh.scratch(this.lastTouch, point);

    this.lastTouch.copy(point);

    event.preventDefault();
  }

  private onTouchEnd() {}
}
