import * as THREE from "three";

export enum ScratchEventTypes {
  onScratchSelected = "onScratchSelected",
  onScratchLoaded = "onScratchLoaded",
  onScratchFinished = "onScratchFinished",
  onScratchingDisabled = "onScratchingDisabled",
}

type ScratchEventInfo = {
  id: number;
};

export class ScratchSelectedEvent extends Event {
  id: number;

  constructor(info: ScratchEventInfo) {
    super(ScratchEventTypes.onScratchSelected);
    Object.assign(this, info);
  }
}

export class ScratchLoadedEvent extends Event {
  id: number;

  constructor(info: ScratchEventInfo) {
    super(ScratchEventTypes.onScratchLoaded);
    Object.assign(this, info);
  }
}

export class ScratchFinishedEvent extends Event {
  id: number;

  constructor(info: ScratchEventInfo) {
    super(ScratchEventTypes.onScratchFinished);
    Object.assign(this, info);
  }
}

export class ScratchingDisabledEvent extends Event {
  id: number;

  constructor(info: ScratchEventInfo) {
    super(ScratchEventTypes.onScratchingDisabled);
    Object.assign(this, info);
  }
}

export type ScratchEvent = {
  from: THREE.Vector2; // In cartesian-pixel coords
  to: THREE.Vector2; // In cartesian-pixel coords
};
