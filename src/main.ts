import "./style.css";
import * as THREE from "three";
import { ScratchManager } from "./scratch/ScratchManager";

// For debugging
const w = window as any;
w.THREE = THREE;

const scratches: ScratchManager[] = (w.managers = []);

function start() {
  const cardDivs = document.getElementsByClassName("card") as HTMLCollectionOf<HTMLDivElement>;
  for (let i = 0; i < cardDivs.length; i++) {
    const div = cardDivs[i];
    scratches.push(new ScratchManager(div));
  }
}

start();
