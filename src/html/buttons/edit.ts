import { Value, ValuesList } from "../../core/values";
import { HTMLSudokuBoard } from "../board";
import {
  CellLocationFromID,
  DoNotDisplay,
  EditOptsButtons,
  SudokuCellBeingEdited,
  SudokuCellEditOptsTableID,
  SudokuCellInEditMode,
} from "../selectors";
import { Button } from "./button";

export class EditButton extends Button {
  private editModeState: "on" | "off" = "off";

  // Related to the edit panel and editing of a sudoku cell value
  private currentEditLocation: { i: number; j: number } | null = null;
  private editOptsTableElement: HTMLTableElement;

  constructor(
    element: HTMLButtonElement,
    private readonly board: HTMLSudokuBoard,
    private readonly editModeOnIcon: SVGElement,
    private readonly editModeOffIcon: SVGElement,
    private readonly afterSuccessfulCellEditing: () => void
  ) {
    super(element);

    // Create the edit panel with all the buttons for the options
    this.editOptsTableElement = document.createElement("table");
    this.editOptsTableElement.id = SudokuCellEditOptsTableID;
    let rowElement = document.createElement("tr");
    this.editOptsTableElement.appendChild(rowElement);
    // Have a clear button for the cell
    let clearDataElement = document.createElement("td");
    let clearButton = document.createElement("button");
    clearButton.innerHTML = " ";
    clearButton.classList.add(EditOptsButtons);
    clearButton.onclick = () => this.uponSelectionFromUser(Value.NONE);
    clearDataElement.appendChild(clearButton);
    rowElement.appendChild(clearDataElement);
    // For each of the other values, have a selection button
    ValuesList.forEach((v) => {
      let dataElement = document.createElement("td");
      let valueButton = document.createElement("button");
      valueButton.classList.add(EditOptsButtons);
      valueButton.innerHTML = `${v}`;
      valueButton.onclick = () => this.uponSelectionFromUser(v);
      dataElement.appendChild(valueButton);
      rowElement.appendChild(dataElement);
    });
    document.body.appendChild(this.editOptsTableElement);

    this.resetEditForLocation();
    this.editModeOnIcon.classList.add(DoNotDisplay);
  }

  changeMode(mode: typeof this.editModeState) {
    if (mode == this.editModeState) {
      // we are already at the desired mode
      return;
    }

    this.editModeState = mode;
    switch (mode) {
      case "on":
        this.onEditModeOn();
        break;
      case "off":
        this.onEditModeOff();
        break;
    }
  }

  private onEditModeOn(): void {
    for (let cell of this.board.cells()) {
      cell.addClass(SudokuCellInEditMode);
      cell.onClick = (mv: MouseEvent) => {
        // Get ID for the clicked cell
        let cellLocation = CellLocationFromID(
          (mv.target as HTMLTableCellElement).id
        );
        if (cellLocation == null) {
          // Was unable to determine the cell from the ID extracted.
          return;
        }
        // Start the editing process for the extracted location
        this.editForLocation(cellLocation);
      };
    }
    this.editModeOnIcon.classList.remove(DoNotDisplay);
    this.editModeOffIcon.classList.add(DoNotDisplay);
  }

  private onEditModeOff(): void {
    this.resetEditForLocation();
    for (let cell of this.board.cells()) {
      cell.removeClass(SudokuCellInEditMode);
      cell.onClick = null;
    }
    this.editModeOnIcon.classList.add(DoNotDisplay);
    this.editModeOffIcon.classList.remove(DoNotDisplay);
  }

  protected functionality(): void {
    if (this.editModeState == "on") {
      // Disable the edit mode
      this.changeMode("off");
    } else {
      // Enable the edit mode
      this.changeMode("on");
    }
  }

  private editForLocation(location: { i: number; j: number }): void {
    // Reset the previous edit location
    this.resetEditForLocation();
    // Unhide the editing panel with all buttons
    this.editOptsTableElement.classList.remove(DoNotDisplay);
    // Set this new location as the editing location
    this.currentEditLocation = location;
    // Mark the current cell as the one being edited currently
    this.board.addClassToCell(location.i, location.j, SudokuCellBeingEdited);
  }

  private uponSelectionFromUser(value: Value) {
    if (this.currentEditLocation == null) {
      // Currently no cell is being edited, nothing to set here
      return;
    }

    // Update the current location with the provided value selected
    let isSuccess = this.board.setValueToCell(
      this.currentEditLocation.i,
      this.currentEditLocation.j,
      value
    );
    if (isSuccess) {
      this.board.blinkCellForSuccess(
        this.currentEditLocation.i,
        this.currentEditLocation.j
      );
      this.board.render();
      this.afterSuccessfulCellEditing();
    } else {
      this.board.blinkCellForFailure(
        this.currentEditLocation.i,
        this.currentEditLocation.j
      );
    }
  }

  resetEditForLocation() {
    if (this.currentEditLocation != null) {
      // Cleanup up the current location being edited
      this.board.removeClassFromCell(
        this.currentEditLocation.i,
        this.currentEditLocation.j,
        SudokuCellBeingEdited
      );
      this.currentEditLocation = null;
    }
    // Hide the editing panel
    this.editOptsTableElement.classList.add(DoNotDisplay);
  }

  specializedResize(
    size: number,
    marginFromTop: number,
    marginFromLeft: number,
    marginFromTopForEditTable: number,
    marginFromLeftForEditTable: number
  ) {
    this.resize(size, marginFromTop, marginFromLeft);

    // Update the size for the edit buttons
    this.editOptsTableElement.firstChild?.childNodes.forEach((dataNode) => {
      (dataNode.firstChild as HTMLButtonElement).setAttribute(
        "style",
        `width:${size}px;height:${size}px;font-size:${size / 2}px`
      );
    });

    // Before setting the top margin for the edit table we need to consider the
    // size of the table itself and subtract it from top margin.
    marginFromTopForEditTable = marginFromTopForEditTable - size;

    // Update the top and left margins for the table element
    this.editOptsTableElement.setAttribute(
      "style",
      `top:${marginFromTopForEditTable}px;left:${marginFromLeftForEditTable}px`
    );
  }
}
