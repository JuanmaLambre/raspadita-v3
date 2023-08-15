import * as THREE from "three";
import { ScratchMesh } from "./ScratchMesh";
import { getScratchContent } from "../backend/getScratchContent";
import { ScratchLoadedEvent, ScratchSelectedEvent } from "../types/ScratchEvent";

const DEBUG_RENDER = false;

export class ScratchManager {
  readonly id: number;
  readonly pxWidth: number; // In CSS pixels
  readonly pxHeight: number; // In CSS pixels

  public scratchMesh: ScratchMesh;
  public enabled: boolean = true;
  public needsUpdate: boolean = true;

  private divElement: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private isScratched: boolean = false;
  private renderer: THREE.WebGLRenderer;

  private lastTouch: THREE.Vector2;

  constructor(id: number, divElement: HTMLDivElement, renderer: THREE.WebGLRenderer) {
    this.id = id;
    this.divElement = divElement;
    this.renderer = renderer;
    this.pxWidth = divElement.offsetWidth;
    this.pxHeight = divElement.offsetHeight;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.pxWidth;
    this.canvas.height = this.pxHeight;
    this.divElement.appendChild(this.canvas);

    this.canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));

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

  update() {
    if (!this.needsUpdate) return;

    this.renderer.render(this.scene, this.camera);

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.renderer.domElement, 0, 0);
    this.needsUpdate = false;
  }

  private onScratchSelected() {
    this.isScratched = true;

    const event = new ScratchSelectedEvent({ id: this.id });
    dispatchEvent(event);

    getScratchContent(this.id).then(this.onContentResponse.bind(this));
  }

  private onTouchStart(event: TouchEvent) {
    if (!this.enabled) return;

    if (!this.scratched) this.onScratchSelected();
    else this.lastTouch.copy(this.getCartesianCoords(event));
  }

  private onTouchMove(event: TouchEvent) {
    event.preventDefault();

    const point = this.getCartesianCoords(event);

    if (!this.enabled || !this.lastTouch) {
      this.lastTouch = point.clone();
      return;
    }

    // Do scratch
    this.scratchMesh.scratch(this.lastTouch, point);
    this.needsUpdate = true;

    this.lastTouch.copy(point);
  }

  private onTouchEnd() {}

  private onContentResponse(response: any) {
    dispatchEvent(new ScratchLoadedEvent({ id: this.id }));
    console.log("RESPONSE:", response);
  }

  /** Calculate touch coordinates relative to canvas in cartesian pixel coords */
  private getCartesianCoords(event: TouchEvent): THREE.Vector2 {
    const { clientX, clientY } = event.targetTouches[0];
    const pixelCoordX = clientX - this.canvas.offsetLeft;
    const pixelCoordY = this.canvas.offsetTop - clientY + this.pxHeight;
    return new THREE.Vector2(pixelCoordX, pixelCoordY);
  }
}
