const DEFAULT_DURATION = 0.15;

export class ScratchAnimation {
  private from: THREE.Vector2;
  private to: THREE.Vector2;
  private duration: number; // Seconds
  private started: number; // Epoch in seconds
  private playing: boolean = false;
  private lastStep: number; // Epoch in seconds

  constructor(from: THREE.Vector2, to: THREE.Vector2, duration: number = DEFAULT_DURATION) {
    this.from = from;
    this.to = to;
    this.duration = duration;
  }

  /** Seconds of animation played */
  get played(): number {
    if (!this.started) return 0;
    else return +new Date() / 1000 - this.started;
  }

  get isPlaying(): boolean {
    return this.playing;
  }

  play() {
    this.started = +new Date() / 1000;
    this.playing = true;
    this.lastStep = this.started;
  }

  stop() {
    this.playing = false;
  }

  /** Call after frame's getStepScratch */
  step() {
    this.lastStep = +new Date() / 1000;

    if (this.started + this.duration < this.lastStep) {
      this.stop();
      this.lastStep = this.started + this.duration;
    }
  }

  /** Returns an array of two THREE.Vector2's (from and to) */
  getStepScratch(): THREE.Vector2[] {
    const now = +new Date() / 1000;
    const stepPercentage = (now - this.lastStep) / this.duration;
    const coveredPercentage = (this.lastStep - this.started) / this.duration;
    const from = this.from.clone().lerp(this.to, coveredPercentage);
    const to = this.from.clone().lerp(this.to, coveredPercentage + stepPercentage);
    return [from, to];
  }
}
