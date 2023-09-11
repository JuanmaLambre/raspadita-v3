import $ from "jquery";
import { selectors } from "../selectors";

export namespace TimeoutMessage {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();
  }

  function init() {
    element = $(selectors.messages.timeout);
    element.hide();
  }

  init();
}
