import * as THREE from "three";
import $ from "jquery";
import { ScratchMesh } from "./ScratchMesh";
import {
  ScratchingDisabledEvent,
  ScratchFinishedEvent,
  ScratchLoadedEvent,
  ScratchSelectedEvent,
} from "../types/ScratchEvent";
import { Backend } from "../backend/Backend";
import { PrizeRepresentation } from "./CardStatus";
import { ContentResponse } from "../backend/responses/ContentResponse";
import { selectors } from "./selectors";

const DEBUG_RENDER = false;

export class ScratchManager {
  readonly pxWidth: number; // In CSS pixels
  readonly pxHeight: number; // In CSS pixels

  static FINISH_THRESHOLD = 70; // Percentage

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
  private prizeElement: HTMLElement;

  private lastTouch: THREE.Vector2;

  static {
    this.setDebugConsole();
  }

  constructor(divElement: HTMLDivElement, renderer: THREE.WebGLRenderer) {
    this.divElement = divElement;
    this.renderer = renderer;
    this.pxWidth = divElement.clientWidth;
    this.pxHeight = divElement.clientHeight;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.pxWidth;
    this.canvas.height = this.pxHeight;
    this.canvas.style.zIndex = "99";
    this.divElement.appendChild(this.canvas);

    this.canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.canvas.addEventListener("touchend", this.onTouchEnd.bind(this));

    // Get texture path from HTML
    this.scratchMesh = new ScratchMesh({ pxWidth: this.pxWidth, pxHeight: this.pxHeight });
    const imgElement = this.divElement.getElementsByClassName(selectors.cards.image)[0] as HTMLImageElement;
    const texture = imgElement?.src;
    this.scratchMesh.setTexture(texture, () => (this.needsUpdate = true));

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

  get id(): number {
    return parseInt(this.divElement.id.match(/^[^\d]*(\d+)$/)[1]);
  }

  get aspect(): number {
    return this.pxWidth / this.pxHeight;
  }

  get scratched(): boolean {
    return this.isScratched;
  }

  setPrize(prize: PrizeRepresentation) {
    this.prize = prize;
    this.showPrize(true);
  }

  update() {
    if (this.scratchMesh.isPlayingAnimation) {
      this.scratchMesh.update();
      this.needsUpdate = true;
    }

    if (!this.needsUpdate) return;

    this.renderer.render(this.scene, this.camera);

    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.renderer.domElement, 0, 0);
    this.needsUpdate = false;
  }

  reveal() {
    this.isScratched = true;
    this.canvas.classList.add("animated-reveal");
    this.needsUpdate = true;
  }

  highlight() {
    this.divElement.classList.add("highlighted");
  }

  private onScratchSelected(point: THREE.Vector2) {
    this.isScratched = true;
    this.scratchMesh.executeScratchAnimation(point);

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

    const point = this.getCartesianCoords(event);

    if (!this.scratched) {
      this.onScratchSelected(point);
      this.lastTouch = point.clone();
      return;
    }

    if (!this.lastTouch) {
      // Note: this is done here rather than onTouchStart because we need to wait for the server's response
      this.lastTouch = point.clone();
      return;
    }

    if (this.lastTouch.distanceTo(point) < 5) return;

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

  private onTouchEnd() {
    this.lastTouch = undefined;
  }

  private onContentResponse(response: ContentResponse) {
    if (!response.isOK) {
      // Redirect home
      console.warn("Respuesta de servidor errónea, redirigiendo a home...");
      location.href = Backend.getHomeURL(response.result);
      return;
    }

    dispatchEvent(new ScratchLoadedEvent({ id: this.id, response }));
    this.prize = response.getPrize(this.id);
    this.showPrize(true);
    console.debug("Premio", this.prize);
  }

  private showPrize(animate = false) {
    const prizeElement = this.getPrizeElement();
    if (prizeElement.parentElement) return;

    if (animate) prizeElement.classList.add("animated-prize");

    this.divElement.appendChild(prizeElement);
  }

  /** Calculate touch coordinates relative to canvas in cartesian pixel coords */
  private getCartesianCoords(event: TouchEvent): THREE.Vector2 {
    const { clientX, clientY } = event.targetTouches[0];
    const { scrollTop, scrollLeft } = document.scrollingElement;

    const pixelCoordX = clientX - this.canvas.parentElement.offsetLeft - scrollLeft;
    const pixelCoordY = this.canvas.parentElement.offsetTop - clientY + this.pxHeight - scrollTop;
    return new THREE.Vector2(pixelCoordX, pixelCoordY).round();
  }

  private static setDebugConsole() {
    const spinner = $("#scratch-threshold")[0] as HTMLInputElement;
    if (!spinner) return;

    spinner.value = ScratchManager.FINISH_THRESHOLD.toString();

    spinner.addEventListener("input", (ev) => {
      ScratchManager.FINISH_THRESHOLD = parseInt(spinner.value);
    });
  }

  private getPrizeElement() {
    if (this.prizeElement) return this.prizeElement;

    const prizeImg = document.createElement("img");
    prizeImg.classList.add("prize");
    prizeImg.src = Backend.getPrizeURL(this.prize);

    return (this.prizeElement = prizeImg);
  }
}
