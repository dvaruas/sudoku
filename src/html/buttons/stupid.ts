import { Button } from "./button";

export class StupidButton extends Button {
  protected functionality(): void {
    throw new Error("Stupid buttons don't have any inherent functionality");
  }
}
