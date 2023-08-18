import * as serverConfig from "./config";
import $ from "jquery";
import { ContentResponse } from "./responses/ContentResponse";

const DEBUG_BACKEND = true;

const config = DEBUG_BACKEND ? serverConfig.debugConfig : serverConfig.config;

export namespace Backend {
  let baseForm: FormData;

  export function init() {
    baseForm = new FormData($("form")[0] as HTMLFormElement);
  }

  export async function callGameStart() {
    const url = config.endpoints.initClock;
    baseForm.set("selec", "");

    const opts = {
      method: "POST",
      body: baseForm,
    };

    return fetch(url, opts);
  }

  export async function getScratchContent(scratchId: number): Promise<ContentResponse> {
    const url = config.endpoints.content;
    baseForm.set("selec", scratchId.toString());

    const opts = {
      method: "POST",
      body: baseForm,
    };

    return fetch(url, opts)
      .then(async (response) => new ContentResponse(await response.json()))
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  }
}
