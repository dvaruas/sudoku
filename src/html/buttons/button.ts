export abstract class Button {
  private elementStyle: Map<String, String> = new Map<String, String>();

  constructor(private readonly element: HTMLButtonElement) {
    element.onclick = () => this.onClick();
  }

  get disabled(): boolean {
    return this.element.disabled;
  }

  disable(disable: boolean) {
    this.element.disabled = disable;
  }

  protected abstract functionality(): void;

  // TODO: This functionality is present for board and cell, could be moved as a
  // mixin
  get style(): string {
    let styleList: string[] = [];
    for (let entry of this.elementStyle.entries()) {
      styleList.push(`${entry[0]}:${entry[1]}`);
    }
    return styleList.join(";");
  }

  onClick() {
    if (this.disabled) {
      return;
    }

    this.functionality();
  }

  resize(size: number, marginFromTop: number, marginFromLeft: number): void {
    this.elementStyle.set("top", `${marginFromTop}px`);
    this.elementStyle.set("left", `${marginFromLeft}px`);
    this.elementStyle.set("width", `${size}px`);
    this.elementStyle.set("height", `${size}px`);
    this.element.setAttribute("style", this.style);
  }
}
