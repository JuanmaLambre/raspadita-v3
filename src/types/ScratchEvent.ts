import * as THREE from "three";

export enum ScratchEventTypes {
  onScratchSelected = "onScratchSelected",
  onScratchLoaded = "onScratchLoaded",
}

export class ScratchSelectedEvent extends Event {
  id: number;

  constructor(info: any) {
    super(ScratchEventTypes.onScratchSelected);
    Object.assign(this, info);
  }
}

export class ScratchLoadedEvent extends Event {
  id: number;

  constructor(info: any) {
    super(ScratchEventTypes.onScratchLoaded);
    Object.assign(this, info);
  }
}

export type ScratchEvent = {
  from: THREE.Vector2; // In cartesian-pixel coords
  to: THREE.Vector2; // In cartesian-pixel coords
};
