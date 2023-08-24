import "./style.scss";
import * as THREE from "three";
import { PageManager } from "./scratch/PageManager";
import { Backend } from "./backend/Backend";
import { WinModal } from "./scratch/modals/WinModal";
import { LostModal } from "./scratch/modals/LostModal";

// For debugging
const w = window as any;
w.THREE = THREE;
w.Backend = Backend;
w.WinModal = WinModal;
w.LostModal = LostModal;

function start(cardClassName = ".card") {
  const pageMangager = new PageManager();
  pageMangager.setup(cardClassName);

  w.page = pageMangager;
  w.managers = pageMangager.scratches;
}

addEventListener("load", () => start());
