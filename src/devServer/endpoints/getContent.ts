import { Request, Response } from "express";

const DEBUG_DELAY = 5000; // milliseconds

export function getContent(req: Request, res: Response) {
  const id = req.query.id;

  setTimeout(() => res.json({ success: true, id }), DEBUG_DELAY);
}
