import * as THREE from "three";
import {
  ScratchEventTypes,
  ScratchFinishedEvent,
  ScratchLoadedEvent,
  ScratchSelectedEvent,
} from "../types/ScratchEvent";
import { ScratchManager } from "./ScratchManager";

const WAIT_SERVER_RESPONSE = false;

export class PageManager {
  scratches: ScratchManager[] = [];

  private renderer: THREE.WebGLRenderer;

  setup(divClassName: string) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setAnimationLoop(this.update.bind(this));

    const cardDivs = document.getElementsByClassName(divClassName) as HTMLCollectionOf<HTMLDivElement>;
    const { offsetWidth: pxWidth, offsetHeight: pxHeight } = cardDivs[0];
    this.renderer.setSize(pxWidth, pxHeight);

    for (let i = 0; i < cardDivs.length; i++) {
      const div = cardDivs[i];
      const scratch = new ScratchManager(i, div, this.renderer);
      this.scratches.push(scratch);
    }

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
    addEventListener(ScratchEventTypes.onScratchFinished, this.onScratchFinished.bind(this));
  }

  update() {
    this.scratches.forEach((mngr) => mngr.update());
  }

  private getScratch(id: number) {
    return this.scratches.find((scratch) => scratch.id == id);
  }

  private onScratchSelected(ev: ScratchSelectedEvent) {
    this.scratches.forEach((mngr) => (mngr.enabled = false));

    if (!WAIT_SERVER_RESPONSE) {
      this.getScratch(ev.id).enabled = true;
    }
  }

  private onScratchLoaded(ev: ScratchLoadedEvent) {
    const scratch = this.getScratch(ev.id);
    scratch.enabled = true;
  }

  private onScratchFinished(ev: ScratchFinishedEvent) {
    console.log("Scratch", ev.id, "finished");
    this.scratches.forEach((mngr) => (mngr.enabled = true));
  }
}
