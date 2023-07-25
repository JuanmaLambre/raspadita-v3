import * as THREE from "three";
import { ScratchMesh } from "./ScratchMesh";

export class ScratchManager {
  readonly width: number;
  readonly height: number;
  readonly renderer: THREE.WebGLRenderer;

  public mesh: ScratchMesh;

  private divElement: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;

  constructor(divElement: HTMLDivElement) {
    this.divElement = divElement;
    this.width = divElement.offsetWidth;
    this.height = divElement.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0x0, 0);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setAnimationLoop(this.render.bind(this));
    this.divElement.appendChild(this.renderer.domElement);

    this.mesh = new ScratchMesh(this.renderer, 2 * this.aspect);
    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
    // this.scene.add(new THREE.AxesHelper(this.aspect / 2));

    this.camera = new THREE.OrthographicCamera(-this.aspect, this.aspect, 1, -1, 0.001, 10);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.scene.add(this.camera);
  }

  get aspect(): number {
    return this.width / this.height;
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }
}
