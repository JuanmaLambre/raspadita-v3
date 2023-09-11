import $ from "jquery";
import { selectors } from "../selectors";

export namespace PopupModal {
  let modalElement: JQuery<HTMLElement>;
  let textElement: HTMLElement;

  function init() {
    modalElement = $(selectors.messages.popup.element);
    textElement = modalElement.find(selectors.messages.popup.text)[0];

    const acceptBtn = modalElement.find(selectors.messages.popup.accept);
    acceptBtn.on("click", hide);

    hide();
  }

  export function show(text?: string) {
    if (text != undefined) textElement.textContent = text;

    modalElement.show();
  }

  export function hide() {
    modalElement.hide();
  }

  init();
}
