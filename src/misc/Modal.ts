import $ from "jquery";

export namespace Modal {
  let modal: HTMLElement;
  let textElement: HTMLElement;
  let closeButton: HTMLButtonElement;

  export function init() {
    modal = $(".modal")[0];
    textElement = $(".modal .modal-text")[0];
    closeButton = $<HTMLButtonElement>(".modal .modal-close")[0];

    closeButton.addEventListener("click", () => hide());

    hide();
  }

  export function show(text?: string) {
    if (text != undefined) setText(text);

    modal.style.display = "flex";
  }

  export function hide() {
    modal.style.display = "none";
  }

  export function setText(text: string) {
    textElement.textContent = text;
  }
}
