import * as THREE from "three";
import { ScratchMesh } from "./ScratchMesh";
import {
  ScratchingDisabledEvent,
  ScratchFinishedEvent,
  ScratchLoadedEvent,
  ScratchSelectedEvent,
} from "../types/ScratchEvent";
import { randomPick } from "../utils/randomPick";
import { Backend } from "../backend/Backend";
import { PrizeRepresentation } from "./CardStatus";
import { ContentResponse } from "../backend/responses/ContentResponse";

const DEBUG_RENDER = false;

const ID_COLORS: { [id: number]: THREE.ColorRepresentation } = {
  1: 0x07fcfe,
  2: 0x024fef,
  3: 0x07fcfe,
  4: 0x024fef,
  5: 0x012f81,
  6: 0x07fcfe,
  7: 0x024fef,
  8: 0x07fcfe,
  9: 0x07fcfe,
  10: 0x012f81,
  11: 0x07fcfe,
  12: 0x024fef,
  13: 0x012f81,
  14: 0x07fcfe,
  15: 0x012f81,
  16: 0x07fcfe,
  17: 0x024fef,
  18: 0x012f81,
  19: 0x07fcfe,
  20: 0x012f81,
};

export class ScratchManager {
  readonly id: number;
  readonly pxWidth: number; // In CSS pixels
  readonly pxHeight: number; // In CSS pixels

  static FINISH_THRESHOLD = 60; // Percentage

  public scratchMesh: ScratchMesh;
  public enabled: boolean = true;
  public needsUpdate: boolean = true;
  public finished: boolean = false;

  private divElement: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private isScratched: boolean = false;
  private renderer: THREE.WebGLRenderer;
  private prize: PrizeRepresentation;

  private lastTouch: THREE.Vector2;

  static {
    this.setDebugConsole();
  }

  constructor(divElement: HTMLDivElement, renderer: THREE.WebGLRenderer) {
    this.id = parseInt(divElement.dataset.cardid);
    this.divElement = divElement;
    this.renderer = renderer;
    this.pxWidth = divElement.clientWidth;
    this.pxHeight = divElement.clientHeight;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.pxWidth;
    this.canvas.height = this.pxHeight;
    this.divElement.appendChild(this.canvas);

    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));

    const color = ID_COLORS[this.id];
    this.scratchMesh = new ScratchMesh({ pxWidth: this.pxWidth, pxHeight: this.pxHeight, color });
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

  setPrize(prize: PrizeRepresentation) {
    this.prize = prize;
    this.showPrize();
  }

  update() {
    if (!this.needsUpdate) return;

    this.renderer.render(this.scene, this.camera);

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.renderer.domElement, 0, 0);
    this.needsUpdate = false;
  }

  reveal() {
    this.scratchMesh.reveal();
  }

  private onScratchSelected() {
    this.isScratched = true;

    const event = new ScratchSelectedEvent({ id: this.id });
    dispatchEvent(event);

    Backend.getScratchContent(this.id).then(this.onContentResponse.bind(this));
  }

  private onTouchMove(event: TouchEvent) {
    if (event.touches.length > 1) return;

    event.preventDefault();

    if (!this.enabled) {
      const event = new ScratchingDisabledEvent({ id: this.id });
      dispatchEvent(event);
      return;
    }

    if (!this.scratched) {
      this.onScratchSelected();
      return;
    }

    const point = this.getCartesianCoords(event);

    if (!this.lastTouch) {
      // Note: this is done here rather than onTouchStart because we need to wait for the server's response
      this.lastTouch = point.clone();
      return;
    }

    // Do scratch
    this.scratchMesh.scratch(this.lastTouch, point);
    this.needsUpdate = true;

    this.lastTouch.copy(point);

    // Notify finish
    if (!this.finished && this.scratchMesh.painted >= ScratchManager.FINISH_THRESHOLD) {
      const event = new ScratchFinishedEvent({ id: this.id });
      dispatchEvent(event);
      this.finished = true;
    }
  }

  private onTouchEnd() {}

  private onContentResponse(response: ContentResponse) {
    dispatchEvent(new ScratchLoadedEvent({ id: this.id, response }));
    this.prize = response.getPrize(this.id);
    this.showPrize(true);
    console.log("RESPONSE:", response);
  }

  private showPrize(animate = false) {
    const prizeElement = this.getPrizeElement();
    prizeElement.style.display = "initial";
    prizeElement.id = undefined;

    if (animate) prizeElement.classList.add("animated-prize");

    this.divElement.appendChild(prizeElement);
  }

  /** Calculate touch coordinates relative to canvas in cartesian pixel coords */
  private getCartesianCoords(event: TouchEvent): THREE.Vector2 {
    const { clientX, clientY } = event.targetTouches[0];
    const { scrollTop, scrollLeft } = document.scrollingElement;

    const pixelCoordX = clientX - this.canvas.parentElement.offsetLeft - scrollLeft;
    const pixelCoordY = this.canvas.parentElement.offsetTop - clientY + this.pxHeight - scrollTop;
    return new THREE.Vector2(pixelCoordX, pixelCoordY);
  }

  private static setDebugConsole() {
    const spinner = document.getElementById("scratch-threshold") as HTMLInputElement;
    if (!spinner) return;

    spinner.value = ScratchManager.FINISH_THRESHOLD.toString();

    spinner.addEventListener("input", (ev) => {
      ScratchManager.FINISH_THRESHOLD = parseInt(spinner.value);
    });
  }

  private getPrizeElement() {
    const prizeId = randomPick(["prize-snacks", "prize-car"]);
    return document.getElementById(prizeId).cloneNode() as HTMLElement;
  }
}
