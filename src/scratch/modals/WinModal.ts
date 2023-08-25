import $ from "jquery";
import { Backend } from "../../backend/Backend";

export namespace WinModal {
  let modalElement: HTMLElement;

  export function setPrize(prizeId: string) {
    const textElement = modalElement.querySelector<HTMLParagraphElement>("p");
    if (textElement) textElement.innerHTML += ` (ID: ${prizeId})`;
  }

  export function setUsed() {
    const textElement = modalElement.querySelector<HTMLElement>("#txtYaUtilizadaGano");
    if (textElement) textElement.style.display = "initial";
  }

  export function show() {
    modalElement.style.display = "flex";
  }

  export function hide() {
    modalElement.style.display = "none";
  }

  // "Private" functions

  function init() {
    modalElement = $("#modal-gano")[0];

    $("#modal-gano #btnCerrar").on("click", hide);
    $("#modal-gano #btnChance").on("click", redirectHome);
  }

  function redirectHome() {
    location.href = Backend.config.host + Backend.config.endpoints.home;
  }

  init();
}
