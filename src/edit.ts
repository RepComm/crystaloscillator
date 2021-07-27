import { Exponent } from "@repcomm/exponent-ts";

export class Edit extends Exponent {
  element: HTMLInputElement;

  constructor () {
    super();
    this.make("input");
    this.applyRootClasses();
    this.addClasses("exponent-edit");
  }
  getValue (): string {
    return this.element.value;
  }
  setValue (v: string): this {
    this.element.value = v;
    return this;
  }
  setEditable (editable: boolean): this {
    this.element.readOnly = !editable;
    return this;
  }
}
