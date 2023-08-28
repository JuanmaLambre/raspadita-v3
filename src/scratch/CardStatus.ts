import $ from "jquery";
import { parsePrizes, parseSelected } from "../backend/parsers";
import { ContentResponse } from "../backend/responses/ContentResponse";

export type PrizeRepresentation = string;
export type GameState = "S" | "N" | "P";

export class CardStatus {
  gameState: GameState;
  prizes: (PrizeRepresentation | null)[];
  selected: number[];
  resultCode: string;
  prizeId?: string;

  static newFromHTML(): CardStatus {
    const status = new CardStatus();

    status.gameState = $("#hidGano").val() as GameState;
    status.prizes = parsePrizes($("#hidTarjeta").val().toString());
    status.selected = parseSelected($("#hidSeleccion").val().toString());
    status.resultCode = $("#hidMensaje").val().toString();
    status.prizeId = $("#hidPremio").val().toString();

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

  get timeExpired(): boolean {
    return this.resultCode == "2102";
  }

  get isInvalid(): boolean {
    const validCodes = ["1000", "2102", "2056"];
    return !validCodes.includes(this.resultCode);
  }

  getPrizeFor(id: number): PrizeRepresentation {
    return this.prizes[id - 1];
  }

  updateWith(response: ContentResponse) {
    this.resultCode = response.result;

    if (this.resultCode != "1000") return;

    this.gameState = response.gameState;
    this.prizes = response.prizes;
    this.selected = response.allSelected;
    this.prizeId = response.prizeId;
  }
}
