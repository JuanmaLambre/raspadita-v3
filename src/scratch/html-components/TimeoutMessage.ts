import $ from "jquery";
import { selectors } from "../selectors";
import { ReturnAppButton } from "./ReturnAppButton";

export namespace TimeoutMessage {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();

    ReturnAppButton.show();
  }

  function init() {
    element = $(selectors.messages.timeout);
    element.hide();
  }

  init();
}
