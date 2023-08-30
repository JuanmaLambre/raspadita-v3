import { GameState } from "../scratch/CardStatus";
import { randomPick } from "../utils/randomPick";

// const prizesOptions = ["106:TABLETS", "203:PREMIO BOXES", "1000:PUNTOS 1000", "2000:PUNTOS 2000", "3000:PUNTOS 3000"];
const prizesOptions = ["au2c7294fa0a68494998_sel.png"];

export namespace MockState {
  let timeout = false;
  const selected: number[] = new Array(3).fill(null);
  const prizes: string[] = new Array(20).fill(null);

  export function clear() {
    selected.fill(null);
    prizes.fill(null);
    timeout = false;
  }

  export function select(id: number) {
    if (selected.indexOf(id) != -1) return;

    if (id == 0) {
      timeout = true;
      prizes.forEach((prize, idx) => {
        if (prize == null) prizes[idx] = randomPick(prizesOptions);
      });
    } else {
      const nextIdx = selected.findIndex((id) => !id);
      if (nextIdx == 3) return;

      selected[nextIdx] = id;
      prizes[id - 1] = randomPick(prizesOptions);
    }

    if (getState() != "P") {
      prizes.forEach((prize, idx) => {
        if (prize == null) prizes[idx] = randomPick(prizesOptions);
      });
    }
  }

  export function getState(): GameState {
    if (timeout) return "N";

    const actuallySelected = selected.filter((id) => id);
    if (actuallySelected.length < 3) return "P";

    const prize0 = prizes[actuallySelected[0] - 1];
    const prize1 = prizes[actuallySelected[1] - 1];
    const prize2 = prizes[actuallySelected[2] - 1];

    if (prize0 == prize1 && prize1 == prize2) return "S";
    else return "N";
  }

  export function prizesString() {
    return prizes.join("|");
  }

  export function selectedString() {
    return selected.join("|");
  }
}
