import { HTMLSudokuBoard } from "../board";
import { Button } from "./button";

export class ResetButton extends Button {
  constructor(
    element: HTMLButtonElement,
    private readonly board: HTMLSudokuBoard,
    private readonly beforeReset: () => void
  ) {
    super(element);
    this.board = board;
  }

  protected functionality(): void {
    this.beforeReset();
    this.board.reset();
    this.board.render();
  }
}
