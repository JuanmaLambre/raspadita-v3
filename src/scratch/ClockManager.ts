import $ from "jquery";
import { Backend } from "../backend/Backend";
import { selectors } from "./selectors";

export enum ClockEvents {
  Timeout = "timeout",
}

export class ClockManager {
  private barElement: HTMLElement;
  private totalSeconds: number;
  private serverRemaining: number; // Remaining seconds
  private startEpoch: number;
  private stopped = false;

  constructor() {
    this.barElement = $(selectors.clock.timeBar)[0];
    this.totalSeconds = parseInt($<HTMLInputElement>("#hidSegundosTotales")[0].value);
    this.serverRemaining = parseInt($<HTMLInputElement>("#hidSegundosRestantes")[0].value);
    this.startEpoch = +new Date();

    if (!this.timeout) this.updateClock();
  }

  get timeout() {
    return this.remaining <= 0;
  }

  /** Dynamic remaining seconds */
  get remaining() {
    return this.serverRemaining - (+new Date() - this.startEpoch) / 1000;
  }

  update() {
    if (!this.stopped) this.updateClock();
  }

  stop() {
    this.stopped = true;
  }

  hide() {
    const section = $(selectors.clock.section);
    section.hide();
  }

  private updateClock() {
    if (this.timeout) this.onTimeout();

    const fillPercentage = Math.min((1 - this.remaining / this.totalSeconds) * 100, 100);
    this.barElement.style.width = `${fillPercentage}%`;
  }

  private onTimeout() {
    console.debug("Timeout");
    this.stop();
    Backend.notifyTimeout();
    dispatchEvent(new Event(ClockEvents.Timeout));
  }
}
