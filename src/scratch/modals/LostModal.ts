import $ from "jquery";

export namespace LostModal {
  let modalElement: HTMLElement;
  let usedElement: HTMLElement;
  let expiredElement: HTMLElement;

  export function init() {
    modalElement = $("#modal-nogano")[0];
    usedElement = $("#modal-nogano #txtYaUtilizadaNoGano")[0];
    expiredElement = $("#modal-nogano #txtTiempoFuera")[0];

    $("#modal-nogano #btnCerrar").on("click", hide);
    $("#modal-nogano #btnChance").on("click", hide);
  }

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
}
