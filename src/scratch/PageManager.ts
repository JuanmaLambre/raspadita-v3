import * as THREE from "three";
import { ScratchEventTypes, ScratchLoadedEvent, ScratchSelectedEvent } from "../types/ScratchEvent";
import { ScratchManager } from "./ScratchManager";

const WAIT_SERVER_RESPONSE = true;

export class PageManager {
  scratches: ScratchManager[] = [];

  private renderer: THREE.WebGLRenderer;

  setup() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setAnimationLoop(this.update.bind(this));

    const cardDivs = document.getElementsByClassName("card") as HTMLCollectionOf<HTMLDivElement>;
    const { offsetWidth: pxWidth, offsetHeight: pxHeight } = cardDivs[0];
    this.renderer.setSize(pxWidth, pxHeight);

    for (let i = 0; i < cardDivs.length; i++) {
      const div = cardDivs[i];
      const scratch = new ScratchManager(i, div, this.renderer);
      this.scratches.push(scratch);
    }

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
  }

  update() {
    this.scratches.forEach((mngr) => mngr.update());
  }

  private onScratchSelected(ev: ScratchSelectedEvent) {
    if (WAIT_SERVER_RESPONSE) {
      console.log("Waiting server response...");
      this.scratches.forEach((mngr) => (mngr.enabled = false));
    }
  }

  private onScratchLoaded(ev: ScratchLoadedEvent) {
    this.scratches.forEach((mngr) => (mngr.enabled = true));
  }
}
