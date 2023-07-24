import * as THREE from "three";
import { BrushCurve } from "../../src/BrushCurve";
import { ThickLineBrush } from "../../src/brushes/ThickLineBrush";

const w = window as any;
w.THREE = THREE;

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
const brushCurve: BrushCurve = (w.brush = new BrushCurve(new ThickLineBrush(0.2)));

w.regenerateCurveMesh = regenerateCurveMesh;
function regenerateCurveMesh() {
  const old = scene.getObjectByName("curve-object");
  if (old) {
    old.userData.disposables?.forEach((obj: any) => obj.dispose?.());
    scene.remove(old);
  }

  const curveGroup = new THREE.Group();
  curveGroup.name = "curve-object";
  const material = new THREE.MeshBasicMaterial({ color: 0x8800ff });
  const geometries = brushCurve.buildGeometries();
  curveGroup.userData.disposables = [...geometries];

  geometries.forEach((geometry) => {
    const mesh = new THREE.Mesh(geometry, material);
    curveGroup.add(mesh);
  });

  scene.add(curveGroup);
}

function onWindowResize() {
  const htmlContent = document.getElementById("content");
  const width = htmlContent.offsetWidth;
  const height = htmlContent.offsetHeight;
  const aspect = width / height;

  camera.left = -aspect;
  camera.right = aspect;
  camera.top = 1;
  camera.bottom = -1;
  camera.near = 0.001;
  camera.far = 100;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function setup() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.getElementById("content").appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333344);
  camera = new THREE.OrthographicCamera();
  camera.position.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AxesHelper());

  window.addEventListener("resize", onWindowResize, false);
  onWindowResize();

  brushCurve.addPoint(new THREE.Vector2(-1, 0.5));
  brushCurve.addPoint(new THREE.Vector2(0.3, -0.7));
  brushCurve.addPoint(new THREE.Vector2(0.6, -0.1));
  brushCurve.addPoint(new THREE.Vector2(0.8, -0.1));
  regenerateCurveMesh();

  renderer.setAnimationLoop(update);
}

function update() {
  renderer.render(scene, camera);
}

setup();
