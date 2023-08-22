import { Request, Response } from "express";
import { config } from "../../backend/config";

export async function bypassRequest(req: Request, res: Response) {
  const pathname = req.url;
  const host = config.url;
  const url = host + pathname;

  const form = new FormData();
  Object.entries(req.body).forEach(([key, value]) => {
    console.log(">>> APPEND", key, value);
    form.set(key, value.toString());
  });

  const opts = {
    method: req.method,
    body: form,
    headers: {
      // "Content-Type": req.headers["content-type"],
      cookie: req.headers.cookie,
    },
  };

  const response = await fetch(url, opts);

  console.log(">>> OPTS", JSON.stringify(opts));

  const result = await response.json();
  console.log(">>> RESULT", JSON.stringify(result));
  res.send(result);
}
