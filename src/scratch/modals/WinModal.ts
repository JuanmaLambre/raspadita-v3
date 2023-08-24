import $ from "jquery";

export namespace WinModal {
  let modalElement: HTMLElement;

  function init() {
    modalElement = $("#modal-gano")[0];

    $("#modal-gano #btnCerrar").on("click", hide);
    $("#modal-gano #btnChance").on("click", hide);
  }

  export function setPrize() {
    // TODO: Set modal prize
  }

  export function setUsed() {
    // TODO: Show "Card already used" message
  }

  export function show() {
    modalElement.style.display = "flex";
  }

  export function hide() {
    modalElement.style.display = "none";
  }

  init();
}
