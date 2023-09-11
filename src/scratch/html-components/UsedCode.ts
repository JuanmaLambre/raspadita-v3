import $ from "jquery";
import { selectors } from "../selectors";

export namespace UsedCode {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();
  }

  function init() {
    element = $(selectors.messages.usedCode);
    element.hide();
  }

  init();
}
