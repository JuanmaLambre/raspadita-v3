import * as express from "express";
import formData from "express-form-data";
import Server from "webpack-dev-server";
import { getContent } from "./endpoints/getContent";
import { initClock } from "./endpoints/initClock";
import { bypassRequest } from "./endpoints/bypassRequest";

export function setup(server: Server, bypassServer = false) {
  server.app.use(express.json());
  server.app.use(formData.parse());

  if (bypassServer) {
    console.debug("Setting up bypass server...");
    server.app.post("/pages/*", bypassRequest);
  } else {
    console.debug("Setting up dev server...");
    server.app.post("/pages/log.ashx", initClock);
    server.app.post("/pages/process_tarjeta.ashx", getContent);
  }
}
