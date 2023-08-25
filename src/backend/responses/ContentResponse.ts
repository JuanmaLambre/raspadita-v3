import { GameState, PrizeRepresentation } from "../../scratch/CardStatus";
import { parsePrizes, parseSelected } from "../parsers";

type ResponseJson = {
  resultado: string; // Number
  resp_gano: GameState;
  resp_mensaje: string; // Number
  resp_tarjeta: string;
  resp_seleccion: string;
  resp_premio: string | null;
};

export class ContentResponse {
  gameState: GameState;
  allSelected: number[];
  prizes: (PrizeRepresentation | null)[];
  result: string;
  prizeId: string = null;

  constructor(serverResponse: ResponseJson) {
    this.result = serverResponse.resultado;

    if (serverResponse.resultado != "1000") {
      console.warn("Código de servidor", this.result);
      return;
    }

    this.gameState = serverResponse.resp_gano;
    this.allSelected = parseSelected(serverResponse.resp_seleccion);
    this.prizes = parsePrizes(serverResponse.resp_tarjeta);
    this.prizeId = serverResponse.resp_premio;
  }

  get isOK(): boolean {
    return this.result == "1000";
  }

  getPrize(scratchId: number) {
    return this.prizes[scratchId - 1];
  }
}
