import "./app.scss";
import { PageManager } from "./scratch/PageManager";
import { Backend } from "./backend/Backend";

// For debugging
const w = window as any;
w.Backend = Backend;

function start(cardClassName = ".carta") {
  const pageMangager = new PageManager();
  pageMangager.setup(cardClassName);

  w.page = pageMangager;
  w.managers = pageMangager.scratches;
}

addEventListener("load", () => start());
