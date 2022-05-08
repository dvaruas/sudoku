import { HTMLSudokuBoard } from "../board";
import { Button } from "./button";

export class SolveNextButton extends Button {
  constructor(
    element: HTMLButtonElement,
    private readonly board: HTMLSudokuBoard,
    private readonly beforeSolveAttempt: () => void,
    private readonly afterSuccessfulSolve: () => void
  ) {
    super(element);
    this.board = board;
  }

  protected functionality() {
    if (this.board.isSolved) {
      // Nothing more to do here
      return;
    }

    this.beforeSolveAttempt();
    let solution = this.board.basicSolver();
    if (solution == null) {
      // Pulling out the big gun..!!
      solution = this.board.advancedSolver();
      if (solution == null) {
        // Might have a chance with basic solver now!
        solution = this.board.basicSolver();
      }
    }

    if (solution != null) {
      // Since this value being set has been computed by our solvers
      // we don't check the return and assume it's always a success
      this.board.setValueToCell(solution.x, solution.y, solution.value);
      this.board.blinkCellForSuccess(solution.x, solution.y);
      this.board.render();
      this.afterSuccessfulSolve();
    }
  }
}
