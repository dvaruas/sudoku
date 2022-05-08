// Table element which would contain the complete sudoku board
export const SudokuBoardID = "sudoku-board";
// Table element which would contain the edit options for a cell
export const SudokuCellEditOptsTableID = "edit-panel";
// Creates the ID according to the row and column number provided
export const SudokuCellID: (i: number, j: number) => string = (i, j) =>
  `s-${i}-${j}`;
export const CellLocationFromID: (
  id: string
) => { i: number; j: number } | null = (id) => {
  let matchCellID = /s-([0-9])-([0-9])/g.exec(id);
  if (matchCellID == null) {
    // unable to extract the location from the given ID
    return null;
  }
  let rowNum = parseInt(matchCellID[1]);
  let colNum = parseInt(matchCellID[2]);
  return { i: rowNum, j: colNum };
};

// All Buttons
export const GithubButtonID = "github-btn";
export const RandomNewButtonID = "random-btn";
export const EditButtonID = "edit-btn";
export const EditModeOnIconID = "edit-btn-on";
export const EditModeOffIconID = "edit-btn-off";
export const ResetButtonID = "reset-btn";
export const SolverButtonID = "solve-btn";
export const HelperButtonID = "helper-btn";
export const HelperModeOnIconID = "helper-btn-on";
export const HelperModeOffIconID = "helper-btn-off";

// Class selectors
// Each row in the sudoku board
export const SudokuRow = "sudoku-row";
// Each individual sudoku cell
export const SudokuCell = "sudoku-cell";
// A sudoku cell when blinking upon successful value placement
export const SudokuCellInSuccessMode = "sudoku-success";
// A sudoku cell when blinking upon a failed value placement
export const SudokuCellInFailureMode = "sudoku-failure";
// Sudoku cell when the helper mode is turned on
export const SudokuCellInHelpMode = "sudoku-help";
// Sudoku cell when the edit mode is turned on
export const SudokuCellInEditMode = "sudoku-editable";
// Sudoku cell which has been selected for editing
export const SudokuCellBeingEdited = "sudoku-edited";
// Buttons provided as options when editing a cell
export const EditOptsButtons = "edit-options-btn";
// Hides the element from the screen
export const DoNotDisplay = "d-none";
