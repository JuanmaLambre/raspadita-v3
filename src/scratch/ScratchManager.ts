import { ScratchLoadedEvent, ScratchSelectedEvent } from "../types/ScratchEvent";
import { Backend } from "../backend/Backend";
import { PrizeRepresentation } from "./CardStatus";
import { ContentResponse } from "../backend/responses/ContentResponse";

export class ScratchManager {
  readonly pxWidth: number; // In CSS pixels
  readonly pxHeight: number; // In CSS pixels

  public enabled: boolean = true;
  public finished: boolean = false;

  private divElement: HTMLDivElement;
  private isScratched: boolean = false;
  private prize: PrizeRepresentation;
  private prizeElement: HTMLElement;

  constructor(divElement: HTMLDivElement) {
    this.divElement = divElement;
    this.pxWidth = divElement.clientWidth;
    this.pxHeight = divElement.clientHeight;

    this.divElement.addEventListener("click", this.onClick.bind(this));
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

  reveal() {
    this.isScratched = true;
    this.divElement.classList.add("animated-reveal");
  }

  highlight() {
    this.divElement.classList.add("highlighted");
  }

  private onScratchSelected() {
    this.isScratched = true;
    this.reveal();

    const event = new ScratchSelectedEvent({ id: this.id });
    dispatchEvent(event);

    Backend.getScratchContent(this.id).then(this.onContentResponse.bind(this));
  }

  private onClick() {
    this.onScratchSelected();
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

  private getPrizeElement() {
    if (this.prizeElement) return this.prizeElement;

    const prizeImg = document.createElement("img");
    prizeImg.classList.add("prize");
    prizeImg.src = Backend.getPrizeURL(this.prize);

    return (this.prizeElement = prizeImg);
  }
}
