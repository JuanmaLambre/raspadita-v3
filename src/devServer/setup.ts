import * as express from "express";
import formData from "express-form-data";
import Server from "webpack-dev-server";
import { getContent } from "./endpoints/getContent";
import { initClock } from "./endpoints/initClock";

export function setup(server: Server) {
  server.app.use(express.json());
  server.app.use(formData.parse());

  server.app.post("/log", initClock);
  server.app.post("/content", getContent);
}
