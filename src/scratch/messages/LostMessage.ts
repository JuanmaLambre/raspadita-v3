import $ from "jquery";
import { selectors } from "../selectors";

export namespace LostMessage {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();
  }

  function init() {
    element = $(selectors.messages.lost);
    element.hide();
  }

  init();
}
