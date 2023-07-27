import { Request, Response } from "express";

export function getContent(req: Request, res: Response) {
  const id = req.query.id;

  res.json({ success: true, id });
}
