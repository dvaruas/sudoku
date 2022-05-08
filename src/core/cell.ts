import { Value, ValuesList } from "./values";

export class CellGroup {
  protected _cells: Cell[] = [];

  get cells(): Cell[] {
    return this._cells;
  }

  addCellToGroup(cell: Cell): void {
    this._cells.push(cell);
  }
}

export class Cell {
  private static readonly allPossibilities: number = 511; // 2 ** 9 - 1

  private _value: Value = Value.NONE;
  private _possibilities: number = Cell.allPossibilities;

  constructor(readonly i: number, readonly j: number) {}

  get isSolved(): boolean {
    return this._value != Value.NONE;
  }

  get possibilities(): number {
    return this._possibilities;
  }

  get value(): Value {
    return this._value;
  }

  set value(value: Value) {
    if (value == Value.NONE) {
      // A value of NONE can't be explicitly set for a cell using the setter.
      // This should be done through a calle to `reset()`.
      return;
    }

    if (this.isValueAPossibility(value) == false) {
      // This value does not fall within the list of possibilities for this
      // cell, cannot set this one.
      return;
    }

    this._value = value;
  }

  private isValueAPossibility(value: number): boolean {
    if ((this._possibilities & (1 << (value - 1))) != 0) {
      return true;
    }
    return false;
  }

  get speculatedList(): Value[] {
    if (this.isSolved) {
      // This cell has already been solved, no need to speculate anymore.
      return [];
    }
    return ValuesList.filter((v) => this.isValueAPossibility(v));
  }

  set speculatedValue(value: Value) {
    if (value == Value.NONE) {
      // A NONE value doesn't help in any speculation.
      return;
    }
    this._possibilities |= 1 << (value - 1);
  }

  set unspeculatedValue(value: Value) {
    if (value == Value.NONE) {
      // A NONE value doesn't help in any non-speculations either
      return;
    }
    this._possibilities &= ~(1 << (value - 1));
  }

  reset() {
    this._possibilities = Cell.allPossibilities;
    this._value = Value.NONE;
  }
}
