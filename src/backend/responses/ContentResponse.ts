import { parsePrizes, parseSelected } from "../parsers";

export class ContentResponse {
  keepsPlaying: boolean;
  hasWon: boolean;
  allSelected: number[];
  prizes: string[];
  result: number;

  constructor(serverResponse: any) {
    this.keepsPlaying = serverResponse.resp_gano == "P";
    this.hasWon = serverResponse.resp_gano == "S";

    this.allSelected = parseSelected(serverResponse.resp_seleccion);
    this.prizes = parsePrizes(serverResponse.resp_tarjeta);
    this.result = parseInt(serverResponse.resultado);
  }
}
