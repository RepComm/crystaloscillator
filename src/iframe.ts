import { Exponent } from "@repcomm/exponent-ts";

export class IFrame extends Exponent {
  element: HTMLIFrameElement;
  constructor () {
    super();

    this.make("iframe");
    this.addClasses("exponent-iframe");
  }
  setAutoPlay (autoplay: boolean): this {
    this.element.allow += "autoplay";
    return this;
  }
  setSource (src: string): this {
    this.element.src = src;
    return this;
  }
}
