export const checkCellIndexValidity: (i: number, j: number) => boolean = (
  i,
  j
) => i >= 0 && i < 9 && j >= 0 && j < 9;

export const getBlockNumFromCellIndices: (i: number, j: number) => number = (
  i,
  j
) => Math.floor(i / 3) * 3 + Math.floor(j / 3);
