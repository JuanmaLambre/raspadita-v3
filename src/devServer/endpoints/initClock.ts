import { Request, Response } from "express";
import { MockState } from "../MockState";

export function initClock(req: Request, res: Response) {
  MockState.clear();
  res.json({ resultado: "" });
}
