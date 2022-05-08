import { HTMLSudokuCell } from "../cell";
import { SudokuCellInFailureMode, SudokuCellInSuccessMode } from "../selectors";

const MAX_BLINK_COUNT = 6;
const INTERVAL_TIMEOUT = 200;

export class ColorBlinker {
  private timer: NodeJS.Timer | undefined = undefined;
  private blinkCounter: number = 0;
  private currentBlinkingCell: HTMLSudokuCell | null = null;

  reset(): void {
    if (this.timer != undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
    this.blinkCounter = 0;
    [SudokuCellInSuccessMode, SudokuCellInFailureMode].forEach((c) =>
      this.currentBlinkingCell?.removeClass(c)
    );
    this.currentBlinkingCell = null;
  }

  private blink(cell: HTMLSudokuCell, isSuccess: boolean): void {
    if (this.timer != undefined) {
      // The timer is not set currently meaning we are not blinking for any cell
      // at the moment.
      this.reset();
    }

    this.currentBlinkingCell = cell;

    let blinkSelector = isSuccess
      ? SudokuCellInSuccessMode
      : SudokuCellInFailureMode;
    this.timer = setInterval(() => {
      if (this.blinkCounter == MAX_BLINK_COUNT) {
        // The blinking days are over, reset everything
        this.reset();
      } else {
        this.blinkCounter % 2 == 0
          ? cell.addClass(blinkSelector)
          : cell.removeClass(blinkSelector);

        this.blinkCounter++;
      }
    }, INTERVAL_TIMEOUT);
  }

  blinkForSuccess(cell: HTMLSudokuCell) {
    this.blink(cell, true);
  }

  blinkForFailure(cell: HTMLSudokuCell) {
    this.blink(cell, false);
  }
}
