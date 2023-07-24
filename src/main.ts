import "./style.css";
import { ScratchManager } from "./ScratchManager";

const scratches: ScratchManager[] = [];

function start() {
  const cardDivs = document.getElementsByClassName("card") as HTMLCollectionOf<HTMLDivElement>;
  for (let i = 0; i < cardDivs.length; i++) {
    const div = cardDivs[i];
    scratches.push(new ScratchManager(div));
  }
}

start();
