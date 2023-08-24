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
import { ClockEvents, ClockManager } from "./ClockManager";
import { WinModal } from "./modals/WinModal";
import { LostModal } from "./modals/LostModal";

const WAIT_SERVER_RESPONSE = false;
const SCRATCH_LIMIT = 3;

export class PageManager {
  scratches: ScratchManager[] = [];

  private renderer: THREE.WebGLRenderer;
  private cardStatus: CardStatus;
  private clockManager: ClockManager;

  get scratchedCount(): number {
    return this.scratches.filter((s) => s.scratched).length;
  }

  setup(divSelector: string) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setAnimationLoop(this.update.bind(this));

    const cardDivs = $<HTMLDivElement>(divSelector);
    const { offsetWidth: pxWidth, offsetHeight: pxHeight } = cardDivs[0];
    this.renderer.setSize(pxWidth, pxHeight);

    // Build scratches
    for (let i = 0; i < cardDivs.length; i++) {
      const div = cardDivs[i];
      const scratch = new ScratchManager(div, this.renderer);
      this.scratches.push(scratch);
    }

    // Initialize all scratches with card status
    this.cardStatus = CardStatus.newFromHTML();
    this.updateScratchPrizes();

    this.cardStatus.prizes.forEach((prize, idx) => {
      if (!prize) return;
      const scratch = this.getScratch(idx + 1);
      scratch.reveal();
    });

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
    addEventListener(ScratchEventTypes.onScratchFinished, this.onScratchFinished.bind(this));
    addEventListener(ScratchEventTypes.onScratchingDisabled, this.onScratchingDisabled.bind(this));

    WinModal.init();
    LostModal.init();
    Backend.init();

    this.clockManager = new ClockManager();
    addEventListener(ClockEvents.Timeout, this.onTimeout.bind(this));

    Backend.callGameStart();

    this.checkLoadStatus();
  }

  update() {
    this.scratches.forEach((mngr) => mngr.update());
    this.clockManager.update();
  }

  private checkLoadStatus() {
    if (this.cardStatus.hasWon) {
      WinModal.setPrize(/* prize argument */);
      WinModal.setUsed();
      WinModal.show();
    } else if (this.cardStatus.hasLost) {
      LostModal.setUsed();
      if (this.cardStatus.timeExpired) LostModal.setTimeExpiration();
      LostModal.show();
    }
  }

  private checkGameStatus() {
    if (this.cardStatus.hasWon) {
      WinModal.setPrize(/* prize argument */);
      WinModal.show();
    } else if (this.cardStatus.hasLost) {
      if (this.cardStatus.timeExpired) LostModal.setTimeExpiration();
      LostModal.show();
    }

    if (!this.cardStatus.stillPlaying) {
      this.clockManager.stop();

      this.scratches.forEach((scratch) => {
        const prize = this.cardStatus.getPrizeFor(scratch.id);
        if (prize) {
          scratch.setPrize(prize);
          scratch.reveal();

          if (!this.cardStatus.selected.includes(scratch.id)) scratch.grayOut();
        }
      });
    }
  }

  private getScratch(id: number) {
    return this.scratches.find((scratch) => scratch.id == id);
  }

  private onTimeout() {
    this.disableScratches();

    Backend.notifyTimeout().then((response) => {
      this.cardStatus.updateWith(response);
      this.checkGameStatus();
    });
  }

  private onScratchSelected(ev: ScratchSelectedEvent) {
    this.disableScratches();

    if (!WAIT_SERVER_RESPONSE) {
      this.getScratch(ev.id).enabled = true;
    }
  }

  private onScratchLoaded(ev: ScratchLoadedEvent) {
    this.cardStatus.updateWith(ev.response);

    const scratch = this.getScratch(ev.id);
    scratch.enabled = true;
  }

  private onScratchFinished(ev: ScratchFinishedEvent) {
    console.log("Scratch", ev.id, "finished");

    if (this.scratchedCount < SCRATCH_LIMIT) {
      this.scratches.forEach((mngr) => (mngr.enabled = true));
    }

    this.checkGameStatus();
  }

  private onScratchingDisabled(ev: ScratchingDisabledEvent) {
    if (this.scratchedCount < SCRATCH_LIMIT) {
      // Modal.show("Seguí raspando antes de seleccionar una raspadita nueva");
    }
  }

  private updateScratchPrizes() {
    this.cardStatus.prizes.forEach((prize, idx) => {
      if (!prize) return;

      const scratch = this.getScratch(idx + 1);
      scratch.setPrize(prize);
    });
  }

  private disableScratches() {
    this.scratches.forEach((scratch) => (scratch.enabled = scratch.scratched));
  }
}
