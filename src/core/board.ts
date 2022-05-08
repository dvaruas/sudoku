import { Cell } from "./cell";
import { AdvancedSolver } from "./solvers/advanced";
import { BasicSolver } from "./solvers/basic";
import { Solution } from "./solvers/solution";
import {
  checkCellIndexValidity,
  getBlockNumFromCellIndices,
} from "./utils/funcs";
import { CellGroupValidator } from "./utils/validator";
import { Value } from "./values";

export const IndexError = Error("invalid index provided");

export class Board {
  private rowValidators: CellGroupValidator[] = [];
  private columnValidators: CellGroupValidator[] = [];
  private blockValidators: CellGroupValidator[] = [];
  protected board: Cell[][] = [];

  constructor(
    cellBuilder: (i: number, j: number) => Cell = (i, j) => new Cell(i, j)
  ) {
    for (let i = 0; i < 9; i++) {
      this.rowValidators.push(new CellGroupValidator());
      this.columnValidators.push(new CellGroupValidator());
      this.blockValidators.push(new CellGroupValidator());
    }

    for (let i = 0; i < 9; i++) {
      let tempArr: Cell[] = [];
      for (let j = 0; j < 9; j++) {
        const cell = cellBuilder(i, j);
        tempArr.push(cell);
        this.rowValidators[i].addCellToGroup(cell);
        this.columnValidators[j].addCellToGroup(cell);
        this.blockValidators[getBlockNumFromCellIndices(i, j)].addCellToGroup(
          cell
        );
      }
      this.board.push(tempArr);
    }
  }

  validateCell(i: number, j: number): boolean {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    return (
      this.rowValidators[i].validate() &&
      this.columnValidators[j].validate() &&
      this.blockValidators[getBlockNumFromCellIndices(i, j)].validate()
    );
  }

  validateBoard(): boolean {
    for (let i = 0; i < 9; i++) {
      if (
        this.rowValidators[i].validate() == false ||
        this.columnValidators[i].validate() == false ||
        this.blockValidators[i].validate() == false
      ) {
        return false;
      }
    }
    return true;
  }

  setValueToCell(i: number, j: number, value: Value): boolean {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    let prevValue = this.board[i][j].value;
    if (prevValue == value) {
      // This cell already is at the desired value, nothing to do here.
      return true;
    }

    if (value == Value.NONE) {
      // Someone is trying to clear up the value previously in this cell
      // Completely reset the cell
      this.board[i][j].reset();
      // Setup the correct possibilities for this cell, by trimming the not
      // possible values from that cell based on related cells.
      this.rowValidators[i].cells.forEach(
        (cell) => (this.board[i][j].unspeculatedValue = cell.value)
      );
      this.columnValidators[j].cells.forEach(
        (cell) => (this.board[i][j].unspeculatedValue = cell.value)
      );
      this.blockValidators[getBlockNumFromCellIndices(i, j)].cells.forEach(
        (cell) => (this.board[i][j].unspeculatedValue = cell.value)
      );
    } else {
      // This is an actual new value being set for this cell, not a cleanup of
      // cell.
      this.board[i][j].value = value;
      if (this.board[i][j].value != value) {
        // Was unable to set this value, meaning the validation for this value
        // must have failed. Nothing to do anymore.
        return false;
      }

      // Not that the value has been set successfully onto the cell, remove this
      // newly set value from the possibility list of other related cells.
      this.rowValidators[i].cells.forEach(
        (cell) => (cell.unspeculatedValue = value)
      );
      this.columnValidators[j].cells.forEach(
        (cell) => (cell.unspeculatedValue = value)
      );
      this.blockValidators[getBlockNumFromCellIndices(i, j)].cells.forEach(
        (cell) => (cell.unspeculatedValue = value)
      );
    }

    // When a new value has been set to this cell, the old value is open for
    // speculation and can be set for all related cells.
    this.rowValidators[i].cells.forEach(
      (cell) => (cell.speculatedValue = prevValue)
    );
    this.columnValidators[j].cells.forEach(
      (cell) => (cell.speculatedValue = prevValue)
    );
    this.blockValidators[getBlockNumFromCellIndices(i, j)].cells.forEach(
      (cell) => (cell.speculatedValue = prevValue)
    );

    return true;
  }

  getSpeculationsForCell(i: number, j: number): Value[] {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    return this.board[i][j].speculatedList;
  }

  isCellSolved(i: number, j: number): boolean {
    if (!checkCellIndexValidity(i, j)) {
      throw IndexError;
    }

    return this.board[i][j].isSolved;
  }

  get isSolved(): boolean {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!this.board[i][j].isSolved) {
          return false;
        }
      }
    }
    return true;
  }

  basicSolver(): Solution | null {
    console.log("Using basic solver");
    return BasicSolver.solve(this.board);
  }

  advancedSolver(): Solution | null {
    console.log(
      "Using advanced solver : Crook's algorithm without Random guessing"
    );
    return AdvancedSolver.solve(
      this.rowValidators,
      this.columnValidators,
      this.blockValidators
    );
  }

  reset(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        this.board[i][j].reset();
      }
    }
  }
}
