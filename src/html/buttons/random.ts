import { StringToValue } from "../../core/values";
import { preloaded } from "../../data/puzzles";
import { HTMLSudokuBoard } from "../board";
import { Button } from "./button";

export class RandomNewButton extends Button {
  constructor(
    element: HTMLButtonElement,
    private readonly board: HTMLSudokuBoard,
    private readonly beforeRandomLoad: () => void
  ) {
    super(element);
  }

  protected functionality(): void {
    this.board.reset();

    let i = Math.floor(Math.random() * preloaded.length);
    for (let [rowNum, entry] of preloaded[i].entries()) {
      let colValues = Number(entry)
        .toString()
        .padStart(9, "0")
        .match(/.{1,1}/g);
      colValues?.forEach((valueStr, colNum) =>
        this.board.setValueToCell(rowNum, colNum, StringToValue(valueStr))
      );
    }

    this.board.render();
    this.beforeRandomLoad();
  }
}
