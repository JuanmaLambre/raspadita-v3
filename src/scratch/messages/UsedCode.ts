import $ from "jquery";
import { selectors } from "../selectors";

export namespace UsedCode {
  let element: JQuery<HTMLElement>;

  export function show() {
    element.show();

    const bgMain = $(selectors.background.class);
    bgMain.removeClass(selectors.background.class);
    bgMain.addClass(selectors.background.lostClass);
  }

  function init() {
    element = $(selectors.messages.usedCode);
    element.hide();
  }

  init();
}
