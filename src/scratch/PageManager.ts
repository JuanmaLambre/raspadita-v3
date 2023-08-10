import { ScratchEventTypes, ScratchLoadedEvent, ScratchSelectedEvent } from "../types/ScratchEvent";
import { ScratchManager } from "./ScratchManager";

const WAIT_SERVER_RESPONSE = true;

export class PageManager {
  scratches: ScratchManager[] = [];

  setup() {
    const cardDivs = document.getElementsByClassName("card") as HTMLCollectionOf<HTMLDivElement>;

    for (let i = 0; i < cardDivs.length; i++) {
      const div = cardDivs[i];
      const scratch = new ScratchManager(i, div);
      this.scratches.push(scratch);
    }

    addEventListener(ScratchEventTypes.onScratchLoaded, this.onScratchLoaded.bind(this));
    addEventListener(ScratchEventTypes.onScratchSelected, this.onScratchSelected.bind(this));
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
