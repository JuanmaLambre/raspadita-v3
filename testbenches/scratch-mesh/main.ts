import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ScratchMesh } from "../../src/ScratchMesh";

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let scratch: ScratchMesh;

function onWindowResize() {
  const htmlContent = document.getElementById("content");
  const width = htmlContent.offsetWidth;
  const height = htmlContent.offsetHeight;
  const aspect = width / height;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function setup() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.getElementById("content").appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333344);
  camera = new THREE.PerspectiveCamera(50, undefined, 0.01, 100);
  camera.position.set(3, 3, 5);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 5, 5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  scene.add(new THREE.AxesHelper());
  scene.add(new THREE.GridHelper(10, 10));

  scratch = new ScratchMesh(renderer, 2 * Math.random() + 1);
  scratch.translateZ(0.05);
  scene.add(scratch);

  scene.add((scratch as any).alphaScene);

  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize, false);
  onWindowResize();

  renderer.setAnimationLoop(update);
}

function update() {
  renderer.render(scene, camera);
}

setup();
