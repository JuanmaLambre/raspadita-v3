import $ from "jquery";
import { parsePrizes, parseSelected } from "../backend/parsers";
import { ContentResponse } from "../backend/responses/ContentResponse";

export type PrizeRepresentation = `${number}:${string}`;
export type GameState = "S" | "N" | "P";

export class CardStatus {
  gameState: GameState;
  prizes: (PrizeRepresentation | null)[];
  selected: number[];

  static newFromHTML(): CardStatus {
    const status = new CardStatus();

    status.gameState = $("#hidGano").val() as GameState;
    status.prizes = parsePrizes($("#hidTarjeta").val().toString());
    status.selected = parseSelected($("#hidSeleccion").val().toString());

    return status;
  }

  get stillPlaying(): boolean {
    return this.gameState == "P";
  }

  get hasWon(): boolean {
    return this.gameState == "S";
  }

  get hasLost(): boolean {
    return this.gameState == "N";
  }

  getPrizeFor(id: number): PrizeRepresentation {
    return this.prizes[id - 1];
  }

  updateWith(response: ContentResponse) {}
}
