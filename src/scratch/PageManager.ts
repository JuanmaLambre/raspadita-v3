import * as THREE from "three";
import $ from "jquery";
import {
  ScratchingDisabledEvent,
  ScratchEventTypes,
  ScratchFinishedEvent,
  ScratchLoadedEvent,
  ScratchSelectedEvent,
} from "../types/ScratchEvent";
import { ScratchManager } from "./ScratchManager";
import { Backend } from "../backend/Backend";
import { CardStatus } from "./CardStatus";

const WAIT_SERVER_RESPONSE = false;
const SCRATCH_LIMIT = 3;

export class PageManager {
  scratches: ScratchManager[] = [];

  private renderer: THREE.WebGLRenderer;
  private cardStatus: CardStatus;

  get scratchedCount(): number {
    return this.scratches.filter((s) => s.scratched).length;
  }

  setup(divClassName: string) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setAnimationLoop(this.update.bind(this));

    const cardDivs = document.getElementsByClassName(divClassName) as HTMLCollectionOf<HTMLDivElement>;
    const { offsetWidth: pxWidth, offsetHeight: pxHeight } = cardDivs[0];
    this.renderer.setSize(pxWidth, pxHeight);

    // Build scratches
    for (let i = 0; i < cardDivs.length; i++) {
      const div = cardDivs[i];
      const scratch = new ScratchManager(i, div, this.renderer);
      this.scratches.push(scratch);
    }

    // Initialize all scratches with card status
    this.cardStatus = CardStatus.newFromHTML();
    this.cardStatus.selected.forEach((id) => {
      const scratch = this.getScratch(id);
      scratch.setPrize(this.cardStatus.getPrizeFor(id));
      scratch.reveal();
    });

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
    addEventListener(ScratchEventTypes.onScratchFinished, this.onScratchFinished.bind(this));
    addEventListener(ScratchEventTypes.onScratchingDisabled, this.onScratchingDisabled.bind(this));

    Backend.init();
    Backend.callGameStart();
  }

  update() {
    this.scratches.forEach((mngr) => mngr.update());
  }

  private get selected() {
    const enabled = this.scratches.filter((s) => s.enabled);
    if (enabled.length > 1) return undefined;
    else return enabled[0];
  }

  private getSelectedFromHTML(): ScratchManager[] {
    const values = $("#hidSeleccion").val().toString().split("|");
    const idsSelected = values.filter((id) => id).map((id) => parseInt(id));
    return idsSelected.map((id) => this.getScratch(id));
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

    if (this.scratchedCount < SCRATCH_LIMIT) {
      this.scratches.forEach((mngr) => (mngr.enabled = true));
    }
  }

  private onScratchingDisabled(ev: ScratchingDisabledEvent) {
    if (this.scratchedCount < SCRATCH_LIMIT) {
      alert("Seguí raspando antes de seleccionar una raspadita nueva");
    }
  }
}
