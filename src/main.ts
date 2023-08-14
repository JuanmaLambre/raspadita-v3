import "./style.scss";
import * as THREE from "three";
import { PageManager } from "./scratch/PageManager";

// For debugging
const w = window as any;
w.THREE = THREE;

function start(cardClassName = "card") {
  const pageMangager = new PageManager();
  pageMangager.setup(cardClassName);

  w.managers = pageMangager.scratches;
}

start();
