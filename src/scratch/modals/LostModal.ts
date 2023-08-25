import $ from "jquery";
import { Backend } from "../../backend/Backend";

export namespace LostModal {
  let modalElement: HTMLElement;
  let usedElement: HTMLElement;
  let expiredElement: HTMLElement;

  export function setUsed() {
    usedElement.style.display = "initial";
  }

  export function setTimeExpiration() {
    expiredElement.style.display = "initial";
  }

  export function show() {
    modalElement.style.display = "flex";
  }

  export function hide() {
    modalElement.style.display = "none";
  }

  // "Private" functions

  function init() {
    modalElement = $("#modal-nogano")[0];
    usedElement = $("#modal-nogano #txtYaUtilizadaNoGano")[0];
    expiredElement = $("#modal-nogano #txtTiempoFuera")[0];

    $("#modal-nogano #btnCerrar").on("click", hide);
    $("#modal-nogano #btnChance").on("click", redirectHome);
  }

  function redirectHome() {
    location.href = Backend.config.host + Backend.config.endpoints.home;
  }

  init();
}
