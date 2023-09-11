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
import { PopupModal } from "./html-components/PopupModal";
import { TimeoutMessage } from "./html-components/TimeoutMessage";
import { LostMessage } from "./html-components/LostMessage";
import { UsedCode } from "./html-components/UsedCode";
import { any } from "../utils/any";

const WAIT_SERVER_RESPONSE = false;
const SCRATCH_LIMIT = 3;
const GAME_FINISH_DELAY = 2000; // Milliseconds

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
    this.updateScratches();

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
    addEventListener(ScratchEventTypes.onScratchFinished, this.onScratchFinished.bind(this));
    addEventListener(ScratchEventTypes.onScratchingDisabled, this.onScratchingDisabled.bind(this));

    this.clockManager = new ClockManager();
    if (!this.cardStatus.stillPlaying) this.clockManager.stop();
    else addEventListener(ClockEvents.Timeout, this.onTimeout.bind(this));

    Backend.callGameStart();

    this.checkLoadStatus();
  }

  update() {
    this.scratches.forEach((mngr) => mngr.update());
    this.clockManager.update();
  }

  private checkLoadStatus() {
    if (this.cardStatus.hasWon) {
      this.onGameWon();
    } else if (this.cardStatus.hasLost) {
      UsedCode.show();
      this.clockManager.hide();
    }
  }

  private checkGameStatus() {
    if (this.cardStatus.hasWon) this.onGameWon();
    else if (this.cardStatus.hasLost) this.onGameLost();

    if (!this.cardStatus.stillPlaying) {
      this.clockManager.stop();
      this.updateScratches();
    }

    if (this.cardStatus.isInvalid) {
      console.error("Código de servidor inválido");
      location.href = Backend.getHomeURL(this.cardStatus.resultCode);
    }
  }

  private onGameWon() {
    console.debug("Ganó");
    location.href = Backend.getWinURL();
  }

  private onGameLost() {
    console.debug("Perdió");

    this.clockManager.hide();

    if (this.cardStatus.timeExpired) TimeoutMessage.show();
    else LostMessage.show();
  }

  private updateScratches() {
    this.scratches.forEach((scratch) => {
      const prize = this.cardStatus.getPrizeFor(scratch.id);
      if (prize) {
        scratch.setPrize(prize);
        scratch.reveal();
        if (this.cardStatus.selected.includes(scratch.id)) scratch.highlight();
      }
    });
  }

  private getScratch(id: number) {
    return this.scratches.find((scratch) => scratch.id == id);
  }

  private onTimeout() {
    TimeoutMessage.show();
    this.clockManager.hide();

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

    if (this.scratchedCount < SCRATCH_LIMIT) this.checkGameStatus();
    else this.clockManager.stop(); // Will check game status at onScratchFinished
  }

  private onScratchFinished(ev: ScratchFinishedEvent) {
    console.debug("Raspadita", ev.id, "terminó");

    if (this.scratchedCount < SCRATCH_LIMIT) {
      this.scratches.forEach((mngr) => (mngr.enabled = true));
    } else {
      console.debug("El juego terminó, esperando", GAME_FINISH_DELAY / 1000, "segundos...");
      setTimeout(this.checkGameStatus.bind(this), GAME_FINISH_DELAY);
    }
  }

  private onScratchingDisabled(ev: ScratchingDisabledEvent) {
    const selected = this.cardStatus.selected.map((id) => this.getScratch(id));
    const showModal = any(selected, (s) => !s.finished);

    if (showModal) PopupModal.show("Seguí raspando antes de seleccionar una raspadita nueva");
  }

  private disableScratches() {
    this.scratches.forEach((scratch) => (scratch.enabled = scratch.scratched));
  }
}
