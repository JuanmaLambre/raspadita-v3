import * as express from "express";
import Server from "webpack-dev-server";
import { getContent } from "./endpoints/getContent";

export function setup(server: Server) {
  server.app.use(express.json());

  server.app.get("/content", getContent);
}
