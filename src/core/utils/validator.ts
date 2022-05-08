import { CellGroup } from "../cell";
import { Value } from "../values";

export class CellGroupValidator extends CellGroup {
  validate(): boolean {
    let decisiveNumber: number = 0;
    for (let cell of this._cells) {
      if (cell.value != Value.NONE) {
        let valueMask = 1 << (cell.value - 1);
        if ((valueMask & decisiveNumber) != 0) {
          // This number was found previously, duplicate value recognized in
          // validator group. Validation fails.
          return false;
        }
        decisiveNumber |= valueMask;
      }
    }
    return true;
  }
}
