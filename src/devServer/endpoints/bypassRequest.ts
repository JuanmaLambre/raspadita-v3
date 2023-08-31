import { Request, Response } from "express";
import { config } from "../../backend/config";

/** Calls actual deployed server */
export async function bypassRequest(req: Request, res: Response) {
  const pathname = req.url;
  const host = config.host;
  const url = host + pathname;

  const form = new FormData();
  Object.entries(req.body).forEach(([key, value]) => {
    form.set(key, value.toString());
  });

  const opts = {
    method: req.method,
    body: form,
    headers: { cookie: req.headers.cookie },
  };

  const response = await fetch(url, opts);

  const result = await response.json();
  console.log(">>> RESULT", JSON.stringify(result));
  res.send(result);
}
