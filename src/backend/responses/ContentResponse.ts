import { GameState, PrizeRepresentation } from "../../scratch/CardStatus";
import { parsePrizes, parseSelected } from "../parsers";

export class ContentResponse {
  gameState: GameState;
  allSelected: number[];
  prizes: (PrizeRepresentation | null)[];
  result: number;

  constructor(serverResponse: any) {
    this.gameState = serverResponse.resp_gano;
    this.allSelected = parseSelected(serverResponse.resp_seleccion);
    this.prizes = parsePrizes(serverResponse.resp_tarjeta);
    this.result = parseInt(serverResponse.resultado);
  }
}
