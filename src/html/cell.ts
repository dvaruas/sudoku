import { Cell } from "../core/cell";
import { Value } from "../core/values";
import { SudokuCell, SudokuCellID } from "./selectors";

export class HTMLSudokuCell extends Cell {
  private elementStyle: Map<String, String> = new Map<String, String>();

  constructor(
    private readonly element: HTMLTableCellElement,
    i: number,
    j: number
  ) {
    super(i, j);
    this.element.id = SudokuCellID(i, j);
    this.element.classList.add(SudokuCell);
  }

  addClass(className: string): void {
    this.element.classList.add(className);
  }

  removeClass(className: string): void {
    this.element.classList.remove(className);
  }

  // TODO: This functionality is present for board and cell, could be moved as a
  // mixin
  get style(): string {
    let styleList: string[] = [];
    for (let entry of this.elementStyle.entries()) {
      styleList.push(`${entry[0]}:${entry[1]}`);
    }
    return styleList.join(";");
  }

  resize(cellSizeStr: string, fontSizeStr: string) {
    this.element.setAttribute("width", `${cellSizeStr}`);
    this.element.setAttribute("height", `${cellSizeStr}`);
    this.elementStyle.set("font-size", fontSizeStr);
    this.element.setAttribute("style", this.style);
  }

  set onClick(fn: ((mv: MouseEvent) => void) | null) {
    this.element.onclick = fn;
  }

  render(forcedValue?: string) {
    if (forcedValue == null) {
      // nothing is forced to be shown, just show the value we have currently
      this.element.innerHTML = this.value == Value.NONE ? "" : `${this.value}`;
    } else {
      // show what is given to us for render
      this.element.innerHTML = forcedValue;
    }
  }
}
