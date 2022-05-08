import { Cell, CellGroup } from "../cell";
import { Solution } from "./solution";

export class AdvancedSolver {
  static solve(
    rowCellGroups: CellGroup[],
    columnCellGroups: CellGroup[],
    blockCellGroups: CellGroup[]
  ): Solution | null {
    // Note: each (row|column|block)CellGroups should have a length of 9
    // elements. Since there is no bounds checker here, this should be ensured
    // from the caller.

    // First approach ::: Finding solution through forced numbers
    const findForcedSolutionAmongCells: (cells: Cell[]) => Solution | null = (
      cells
    ) => {
      let unsolvedCells = cells.filter((cell) => cell.isSolved == false);
      for (let i = 0; i < unsolvedCells.length; i++) {
        let testBitStream = unsolvedCells[i].possibilities;
        for (let j = 0; j < unsolvedCells.length; j++) {
          if (i != j) {
            testBitStream &= ~unsolvedCells[j].possibilities;
            if (testBitStream == 0) {
              break;
            }
          }
        }

        if (testBitStream > 0 && !(testBitStream & (testBitStream - 1))) {
          // Checking if there is a difference of only a single possibility
          // between the two cells, this could be an answer then
          return {
            x: unsolvedCells[i].i,
            y: unsolvedCells[i].j,
            value: Math.log2(testBitStream) + 1,
          };
        }
      }
      return null;
    };
    let forcedNumberSolution: Solution | null = null;
    for (let i = 0; i < 9; i++) {
      // try out the row group
      forcedNumberSolution = findForcedSolutionAmongCells(
        rowCellGroups[i].cells
      );
      if (forcedNumberSolution != null) {
        return forcedNumberSolution;
      }
      // try out the column group
      forcedNumberSolution = findForcedSolutionAmongCells(
        columnCellGroups[i].cells
      );
      if (forcedNumberSolution != null) {
        return forcedNumberSolution;
      }
      // try out the block group
      forcedNumberSolution = findForcedSolutionAmongCells(
        blockCellGroups[i].cells
      );
      if (forcedNumberSolution != null) {
        return forcedNumberSolution;
      }
    }

    // Second approach ::: Create pre-emptive sets and remove speculations
    const getSetsForOpportunityType: (cells: Cell[]) => Cell[][] = (cells) => {
      let unsolvedCells = cells.filter((cell) => cell.isSolved == false);
      let elemsList: { cells: Cell[]; mask: number }[] = [];
      unsolvedCells.forEach((cell, indx) =>
        elemsList.push({ cells: [cell], mask: 1 << indx })
      );

      let comboSets: { [indx: number]: { cells: Cell[]; mask: number }[] } = {};
      comboSets[1] = elemsList;

      for (let i = 2; i < unsolvedCells.length; i++) {
        comboSets[i] = [];
        for (let entry of comboSets[i - 1]) {
          for (let singleObj of comboSets[1]) {
            if ((entry.mask | singleObj.mask) != entry.mask) {
              let cells = [...entry.cells];
              cells.push(singleObj.cells[0]);
              comboSets[i].push({
                cells: cells,
                mask: entry.mask | singleObj.mask,
              });
            }
          }
        }
      }

      let resultingElements: Cell[][] = [];
      for (let i = 2; i < unsolvedCells.length; i++) {
        let checkElements = comboSets[i].filter((setElem) => {
          let objMask = setElem.cells.reduce(
            (res, cell) => (res |= cell.possibilities),
            0
          );
          return (
            setElem.cells.length ==
            (Number(objMask).toString(2).match(/1/g) || []).length
          );
        });
        checkElements.forEach((setElem) =>
          resultingElements.push(setElem.cells)
        );
      }
      return resultingElements;
    };

    let finalResultingElements: { cells: Cell[]; type: string }[] = [];
    for (let i = 2; i < 9; i++) {
      // for the row group
      getSetsForOpportunityType(rowCellGroups[i].cells).forEach((cells) =>
        finalResultingElements.push({ cells: cells, type: "row" })
      );
      // for the column group
      getSetsForOpportunityType(columnCellGroups[i].cells).forEach((cells) =>
        finalResultingElements.push({ cells: cells, type: "column" })
      );
      // for the block group
      getSetsForOpportunityType(blockCellGroups[i].cells).forEach((cells) =>
        finalResultingElements.push({ cells: cells, type: "block" })
      );
    }

    for (let element of finalResultingElements) {
      let otherCells: Cell[] = [];
      let posX = element.cells[0].i;
      let posY = element.cells[0].j;

      if (element.type == "row") {
        otherCells = rowCellGroups[posX].cells.filter(
          (cell) => !element.cells.includes(cell)
        );
      } else if (element.type == "column") {
        otherCells = columnCellGroups[posY].cells.filter(
          (cell) => !element.cells.includes(cell)
        );
      } else if (element.type == "block") {
        otherCells = blockCellGroups[
          Math.floor(posX / 3) * 3 + Math.floor(posY / 3)
        ].cells.filter((cell) => !element.cells.includes(cell));
      }

      let cumulativeBit = element.cells.reduce(
        (res, cell) => (res |= cell.possibilities),
        0
      );
      let theNonSpeculationsList: number[] = [];
      for (let i = 0; i < 9; i++) {
        if ((cumulativeBit & (1 << i)) != 0) {
          theNonSpeculationsList.push(i + 1);
        }
      }

      otherCells.forEach((cell) => {
        theNonSpeculationsList.forEach((val) => {
          cell.unspeculatedValue = val;
        });
      });
    }

    return null;
  }
}
