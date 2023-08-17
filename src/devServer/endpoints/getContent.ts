import { Request, Response } from "express";
import { randomPick } from "../../utils/randomPick";

const DEBUG_DELAY = 1000; // milliseconds

export function getContent(req: Request, res: Response) {
  const scratchId = req.body.selec;

  const card = new Array(20).fill("");
  card[scratchId - 1] = randomPick(["3000:PUNTOS 3000"]);

  const response: any = {
    resultado: "1000",
    resp_gano: "P",
    resp_mensaje: null,
    resp_tarjeta: card.join("|"),
    resp_seleccion: `${scratchId}||`,
    resp_premio: null,
  };

  setTimeout(() => res.json(response), DEBUG_DELAY);
}
