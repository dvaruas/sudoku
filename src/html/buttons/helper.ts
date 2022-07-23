import { HTMLSudokuBoard } from "../board";
import { DoNotDisplay, SudokuCellInHelpMode } from "../selectors";
import { Button } from "./button";

export class HelperModeButton extends Button {
  private helperModeState: "on" | "off" = "off";

  constructor(
    element: HTMLButtonElement,
    private readonly board: HTMLSudokuBoard,
    private readonly helperModeOnIcon: SVGElement,
    private readonly helperModeOffIcon: SVGElement
  ) {
    super(element);
    this.helperModeOnIcon.classList.add(DoNotDisplay);
  }

  changeMode(mode: typeof this.helperModeState) {
    if (mode == this.helperModeState) {
      // we are already at the desired mode
      return;
    }

    this.helperModeState = mode;
    switch (mode) {
      case "on":
        this.onHelperModeOn();
        break;
      case "off":
        this.onHelperModeOff();
        break;
    }
  }

  private onHelperModeOn(): void {
    this.helperModeOffIcon.classList.add(DoNotDisplay);
    this.helperModeOnIcon.classList.remove(DoNotDisplay);
    this.updateHelperText();
  }

  private onHelperModeOff(): void {
    this.helperModeOffIcon.classList.remove(DoNotDisplay);
    this.helperModeOnIcon.classList.add(DoNotDisplay);
    for (let cell of this.board.cells()) {
      cell.removeClass(SudokuCellInHelpMode);
      cell.render();
    }
  }

  protected functionality() {
    if (this.helperModeState == "on") {
      // disable the helper mode
      this.changeMode("off");
    } else {
      // enable the helper mode
      this.changeMode("on");
    }
  }

  updateHelperText() {
    if (this.helperModeState == "off") {
      // we are not in helper mode at the moment
      return;
    }

    for (let cell of this.board.cells()) {
      let speculatedList = cell.speculatedList;
      if (speculatedList.length == 0) {
        // this cell must be already solved since there are no more speculations
        cell.removeClass(SudokuCellInHelpMode);
        cell.render();
        continue;
      }
      cell.addClass(SudokuCellInHelpMode);
      cell.render(speculatedList.join(","));
    }
  }
}
