import { config } from "./config";

export async function getScratchContent(scratchNo: number) {
  const url = config.endpoints.debug.content + "?" + new URLSearchParams({ id: scratchNo.toString() });

  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}
