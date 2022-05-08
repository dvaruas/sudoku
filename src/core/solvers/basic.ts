import { Cell } from "../cell";
import { Value } from "../values";
import { Solution } from "./solution";

export class BasicSolver {
  static solve(board: Cell[][]): Solution | null {
    // The board should always have dimensions of 9x9
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j].value == Value.NONE) {
          if (!(board[i][j].possibilities & (board[i][j].possibilities - 1))) {
            return {
              x: i,
              y: j,
              value: Math.log2(board[i][j].possibilities) + 1,
            };
          }
        }
      }
    }
    return null;
  }
}
