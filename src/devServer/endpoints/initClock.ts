import { Request, Response } from "express";

export function initClock(req: Request, res: Response) {
  res.json({ resultado: "" });
}
