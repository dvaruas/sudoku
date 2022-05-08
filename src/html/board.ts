import { Board, IndexError } from "../core/board";
import { checkCellIndexValidity } from "../core/utils/funcs";
import { HTMLSudokuCell } from "./cell";
import { SudokuRow } from "./selectors";
import { ColorBlinker } from "./utils/blinker";

export class HTMLSudokuBoard extends Board {
  private readonly colorBlinker = new ColorBlinker();
  private elementStyle: Map<String, String> = new Map<String, String>();

  constructor(private readonly element: HTMLTableElement) {
    let rows: HTMLTableRowElement[] = [];
    for (let i = 0; i < 9; i++) {
      let rowElement = document.createElement("tr");
      rowElement.classList.add(SudokuRow);
      element.appendChild(rowElement);
      rows.push(rowElement);
    }

    super((i, j) => {
      let cellElement = document.createElement("td");
      rows[i].appendChild(cellElement);
      return new HTMLSudokuCell(cellElement, i, j);
    });

    this.element = element;
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

  resize(boardSize: number, marginFromTop: number, marginFromLeft: number) {
    this.element.setAttribute("width", `${boardSize}px`);
    this.element.setAttribute("height", `${boardSize}px`);
    this.elementStyle.set("top", `${marginFromTop}px`);
    this.elementStyle.set("left", `${marginFromLeft}px`);
    this.element.setAttribute("style", this.style);

    let cellSize = `${boardSize / 13}px`;
    let fontSize = `${boardSize / 40}px`;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        (this.board[i][j] as HTMLSudokuCell).resize(cellSize, fontSize);
      }
    }
  }

  blinkCellForSuccess(i: number, j: number) {
    this.colorBlinker.blinkForSuccess(this.board[i][j] as HTMLSudokuCell);
  }

  blinkCellForFailure(i: number, j: number) {
    this.colorBlinker.blinkForFailure(this.board[i][j] as HTMLSudokuCell);
  }

  *cells(): Generator<HTMLSudokuCell> {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        yield this.board[i][j] as HTMLSudokuCell;
      }
    }
  }

  addClassToCell(i: number, j: number, className: string) {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    (this.board[i][j] as HTMLSudokuCell).addClass(className);
  }

  removeClassFromCell(i: number, j: number, className: string) {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    (this.board[i][j] as HTMLSudokuCell).removeClass(className);
  }

  render() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        (this.board[i][j] as HTMLSudokuCell).render();
      }
    }
  }
}
