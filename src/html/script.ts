import { ValuesList } from "../core/values";
import { HTMLSudokuBoard } from "./board";
import { EditButton } from "./buttons/edit";
import { HelperModeButton } from "./buttons/helper";
import { RandomNewButton } from "./buttons/random";
import { ResetButton } from "./buttons/reset";
import { SolveNextButton } from "./buttons/solve";
import { StupidButton } from "./buttons/stupid";
import {
  EditButtonID,
  EditModeOffIconID,
  EditModeOnIconID,
  GithubButtonID,
  HelperButtonID,
  HelperModeOffIconID,
  HelperModeOnIconID,
  RandomNewButtonID,
  ResetButtonID,
  SolverButtonID,
  SudokuBoardID,
} from "./selectors";

document.addEventListener("DOMContentLoaded", function (_) {
  // All Crucial elements
  let board: HTMLSudokuBoard | null = null;
  let github: StupidButton | null = null;
  let helper: HelperModeButton | null = null;
  let solver: SolveNextButton | null = null;
  let reset: ResetButton | null = null;
  let edit: EditButton | null = null;
  let randomNew: RandomNewButton | null = null;

  // Sudoku Board
  let boardElement = document.getElementById(SudokuBoardID) as HTMLTableElement;
  if (boardElement != null) {
    board = new HTMLSudokuBoard(boardElement);
    // initial display of sudoku board - fillup with number pattern
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let k = (j + 3 * (i % 3) + Math.floor(i / 3)) % 9;
        board.setValueToCell(i, j, ValuesList[k]);
      }
    }
    board.render();
  }

  // GitHub button
  let githubElement = document.getElementById(
    GithubButtonID
  ) as HTMLButtonElement;
  if (githubElement != null) {
    github = new StupidButton(githubElement);
  }
  // helper button functionality
  let helperElement = document.getElementById(
    HelperButtonID
  ) as HTMLButtonElement;
  let helperModeOnIconElement = document.getElementById(
    HelperModeOnIconID
  ) as HTMLElement & SVGElement;
  let HelperModeOffIconElement = document.getElementById(
    HelperModeOffIconID
  ) as HTMLElement & SVGElement;
  if (
    helperElement != null &&
    helperModeOnIconElement != null &&
    HelperModeOffIconElement != null &&
    board != null
  ) {
    helper = new HelperModeButton(
      helperElement,
      board,
      helperModeOnIconElement,
      HelperModeOffIconElement
    );
  }

  // solver button functionality
  let solverElement = document.getElementById(
    SolverButtonID
  ) as HTMLButtonElement;
  if (solverElement != null && board != null) {
    solver = new SolveNextButton(
      solverElement,
      board,
      () => edit?.changeMode("off"),
      () => helper?.updateHelperText()
    );
  }

  // edit button functionality
  let editElement = document.getElementById(EditButtonID) as HTMLButtonElement;
  let editModeOnIconElement = document.getElementById(
    EditModeOnIconID
  ) as HTMLElement & SVGElement;
  let editModeOffIconElement = document.getElementById(
    EditModeOffIconID
  ) as HTMLElement & SVGElement;
  if (
    editElement != null &&
    editModeOnIconElement != null &&
    editModeOffIconElement != null &&
    board != null
  ) {
    edit = new EditButton(
      editElement,
      board,
      editModeOnIconElement,
      editModeOffIconElement,
      () => helper?.updateHelperText() // update the helper text after editing is done
    );
  }

  // reset button functionality
  let resetElement = document.getElementById(
    ResetButtonID
  ) as HTMLButtonElement;
  if (resetElement != null && board != null) {
    reset = new ResetButton(resetElement, board, () => {
      helper?.changeMode("off");
      edit?.changeMode("off");
    });
  }

  // random puzzle setup button functionality
  let randomNewElement = document.getElementById(
    RandomNewButtonID
  ) as HTMLButtonElement;
  if (randomNewElement != null && board != null) {
    randomNew = new RandomNewButton(randomNewElement, board, () => {
      helper?.changeMode("off");
      edit?.changeMode("off");
    });
  }

  const sizeEverythingUp = () => {
    let boardSize = Math.floor(
      Math.min(window.innerHeight, window.innerWidth) * 0.8
    );
    let marginFromTop = (window.innerHeight - boardSize) / 2;
    let marginFromLeft = (window.innerWidth - boardSize) / 2;

    let buttonSize = boardSize / 20;
    let spaceBetweenBoardAndButton = buttonSize / 2;
    let marginFromLeftForButton =
      marginFromLeft - buttonSize - spaceBetweenBoardAndButton;
    let marginFromLeftForRightButton =
      marginFromLeft + boardSize + spaceBetweenBoardAndButton;
    let spaceBetweenButtons = buttonSize * 2;

    board?.resize(boardSize, marginFromTop, marginFromLeft);

    // Buttons on the left side, from top to bottom
    // GitHub button
    github?.resize(buttonSize, marginFromTop, marginFromLeftForButton);
    // Random New button
    randomNew?.resize(
      buttonSize,
      marginFromTop + spaceBetweenButtons,
      marginFromLeftForButton
    );
    // Reset button
    reset?.resize(
      buttonSize,
      marginFromTop + 2 * spaceBetweenButtons,
      marginFromLeftForButton
    );
    // Buttons on the right side, from top to bottom
    // Helper button
    helper?.resize(buttonSize, marginFromTop, marginFromLeftForRightButton);
    // Solver button
    solver?.resize(
      buttonSize,
      marginFromTop + spaceBetweenButtons,
      marginFromLeftForRightButton
    );
    // Edit button
    edit?.specializedResize(
      buttonSize,
      marginFromTop + 4 * spaceBetweenButtons,
      marginFromLeftForRightButton,
      marginFromTop - spaceBetweenBoardAndButton,
      marginFromLeft
    );
  };

  // perform the initial sizing up for everything
  sizeEverythingUp();

  // perform sizing whenever the window is resized
  window.onresize = sizeEverythingUp;
});
