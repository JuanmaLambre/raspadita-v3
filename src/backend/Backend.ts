import $ from "jquery";
import { ContentResponse } from "./responses/ContentResponse";
import { BackendConfig } from "./config";

const config: BackendConfig =
  process.env.NODE_ENV == "production" ? require("./config").config : require("./config").debugConfig;

export namespace Backend {
  let baseForm: FormData;

  export function init() {
    baseForm = new FormData($("form[name=form1]")[0] as HTMLFormElement);

    if (!baseForm) {
      console.warn("Dev: No se encontró el form con las variables");
    }

    if (!document.cookie) {
      console.warn("Dev: Faltan cookies");
    }
  }

  export async function callGameStart() {
    const url = config.host + config.endpoints.initClock;
    baseForm.set("selec", "");

    const opts: RequestInit = {
      method: "POST",
      body: baseForm,
      headers: { cookie: document.cookie },
    };

    return fetch(url, opts);
  }

  export async function getScratchContent(scratchId: number): Promise<ContentResponse> {
    const url = config.host + config.endpoints.content;
    baseForm.set("selec", scratchId.toString());

    const opts: RequestInit = {
      method: "POST",
      body: baseForm,
      headers: { cookie: document.cookie },
    };

    return fetch(url, opts)
      .then(async (response) => new ContentResponse(await response.json()))
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  }

  export async function notifyTimeout() {
    const url = config.host + config.endpoints.content;
    baseForm.set("selec", "0");

    const opts: RequestInit = {
      method: "POST",
      body: baseForm,
      headers: { cookie: document.cookie },
    };

    return fetch(url, opts)
      .then(async (response) => new ContentResponse(await response.json()))
      .catch((error) => {
        console.error("Error:", error);
        return null;
      });
  }

  export function getPrizeURL(filename: string): string {
    return config.host + config.endpoints.images + filename;
  }
}
