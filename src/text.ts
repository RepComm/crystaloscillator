
import { Exponent } from "@repcomm/exponent-ts";

export class Text extends Exponent {
  constructor () {
    super();
    this.make("span");
    this.addClasses("exponent-text");
    this.applyRootClasses();
  }
  setFontSize (size: string): this {
    this.setStyleItem("font-size", size);
    return this;
  }
}
