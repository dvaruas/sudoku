import { Value } from "../values";

export type Solution = { x: number; y: number; value: Value };

export const InvalidParametersError = Error(
  "parameters provided are of incorrect length"
);
