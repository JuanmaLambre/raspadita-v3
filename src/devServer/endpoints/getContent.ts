import { Request, Response } from "express";
import { MockState } from "../MockState";

const DEBUG_DELAY = 1000; // milliseconds

export function getContent(req: Request, res: Response) {
  const scratchId = req.body.selec;

  MockState.select(scratchId);

  const response: any = {
    resultado: "1000",
    resp_gano: MockState.getState(),
    resp_mensaje: null,
    resp_tarjeta: MockState.prizesString(),
    resp_seleccion: MockState.selectedString(),
    resp_premio: null,
  };

  setTimeout(() => res.json(response), DEBUG_DELAY);
}
