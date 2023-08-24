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

  constructor(serverResponse: ResponseJson) {
    if (serverResponse.resultado != "1000") console.warn("Dev: Resultado de response != 1000");

    this.gameState = serverResponse.resp_gano;
    this.allSelected = parseSelected(serverResponse.resp_seleccion);
    this.prizes = parsePrizes(serverResponse.resp_tarjeta);
    this.result = serverResponse.resultado;
  }

  getPrize(scratchId: number) {
    return this.prizes[scratchId - 1];
  }
}
