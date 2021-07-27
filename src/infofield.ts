
import { Panel } from "@repcomm/exponent-ts";
import { Edit } from "./edit";

import { Text } from "./text";

export class InfoField extends Panel {
  private label: Text;
  private edit: Edit;
  
  constructor () {
    super();

    this.addClasses("infofield");

    this.label = new Text()
    .addClasses("infofield-label")
    .setTextContent("Label")
    .mount(this);

    this.edit = new Edit ()
    .addClasses("infofield-edit")
    .mount(this);
  }
  setLabel (text: string): this {
    this.label.setTextContent(text);
    return this;
  }
  setValue (v: string): this {
    this.edit.setValue(v);
    return this;
  }
  getValue (): string {
    return this.edit.getValue();
  }
  setEditable (editable: boolean): this {
    this.edit.setEditable(editable);
    return this;
  }
}
