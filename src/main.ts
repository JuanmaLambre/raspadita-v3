import "./style.scss";
import * as THREE from "three";
import { ScratchManager } from "./scratch/ScratchManager";
import { PageManager } from "./scratch/PageManager";

// For debugging
const w = window as any;
w.THREE = THREE;

const pageMangager = new PageManager();

const scratches: ScratchManager[] = (w.managers = []);

function start() {
  pageMangager.setup();

  w.managers = pageMangager.scratches;
}

start();
