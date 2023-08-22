import * as express from "express";
import formData from "express-form-data";
import Server from "webpack-dev-server";
import { getContent } from "./endpoints/getContent";
import { initClock } from "./endpoints/initClock";
import { bypassRequest } from "./endpoints/bypassRequest";

const BYPASS_SERVER = true; // Call actual server

export function setup(server: Server) {
  server.app.use(express.json());
  server.app.use(formData.parse());

  if (BYPASS_SERVER) {
    server.app.post("/pages/*", bypassRequest);
  } else {
    server.app.post("/pages/log.ashx", initClock);
    server.app.post("/pages/process_tarjeta.ashx", getContent);
  }
}
