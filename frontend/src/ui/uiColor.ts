export type ColorType =
  | "text"
  | "black"
  | "white"
  | "notice"
  | "red"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "link";

export class UIColor {
  constructor(private color: ColorType) {}

  getCSSColorName(isDark: boolean): string {
    switch (this.color) {
      case "text":
        return isDark ? "white" : "black";
      case "black":
        return "black";
      case "white":
        return "white";
      case "notice":
        return "red";
      case "red":
        return isDark ? "#FF3333" : "red";
      case "blue":
        return isDark ? "skyblue" : "blue";
      case "green":
        return isDark ? "lightgreen" : "green";
      case "purple":
        return isDark ? "violet" : "purple";
      case "orange":
        return isDark ? "wheat" : "orange";
      case "link":
        return isDark ? "cyan" : "blue";
    }
  }
}
