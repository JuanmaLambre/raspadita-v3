import $ from "jquery";

export namespace DebugModal {
  let modalElement: HTMLElement;
  let textElement: HTMLElement;

  export function init() {
    modalElement = $("#modal-debug")[0];
    textElement = $("#modal-debug #text")[0];

    $("#modal-debug #btnCerrar").on("click", hide);
  }

  export function show(text?: string) {
    if (text != undefined) textElement.textContent = text;

    modalElement.style.display = "flex";
  }

  export function hide() {
    modalElement.style.display = "none";
  }
}
