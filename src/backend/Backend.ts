import * as serverConfig from "./config";

const DEBUG_BACKEND = true;

const config = DEBUG_BACKEND ? serverConfig.debugConfig : serverConfig.config;

export namespace Backend {
  let baseForm: FormData;

  export function init() {
    baseForm = new FormData(document.querySelector("form"));
  }

  export async function callGameStart() {
    const url = config.endpoints.initClock;

    const opts = {
      method: "POST",
      body: baseForm,
    };

    return fetch(url, opts);
  }

  export async function getScratchContent(scratchNo: number) {
    const url = config.endpoints.content + "?" + new URLSearchParams({ id: scratchNo.toString() });

    const opts = {
      method: "POST",
      body: JSON.stringify({}),
    };

    return fetch(url, opts)
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
