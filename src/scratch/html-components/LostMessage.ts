import $ from "jquery";
import { selectors } from "../selectors";
import { ReturnAppButton } from "./ReturnAppButton";

export namespace LostMessage {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();

    ReturnAppButton.show();
  }

  function init() {
    element = $(selectors.messages.lost);
    element.hide();
  }

  init();
}
