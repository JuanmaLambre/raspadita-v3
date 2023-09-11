import $ from "jquery";
import { selectors } from "../selectors";

export namespace ReturnAppButton {
  export function show() {
    const element = $(selectors.returnBtn);
    element.show();

    const bgMain = $("." + selectors.background.class)?.[0];
    bgMain?.classList.replace(selectors.background.class, selectors.background.lostClass);
  }

  export function hide() {
    const element = $(selectors.returnBtn);
    element.show();

    const bgMain = $("." + selectors.background.lostClass)?.[0];
    bgMain?.classList.replace(selectors.background.lostClass, selectors.background.class);
  }
}
