import Color from "color";

export type MonaRGB = { r: number; g: number; b: number };
export type MonaHexColor = string;

export default {
  theme: {
    text: "#000000",
    error: "#ff0000",
    darkText: "#ffffff",
  },
  hexToMonaRGB(hex: string) {
    let color;
    try {
      color = Color(hex);
    } catch (error) {
      color = Color("#FFFFFF");
    }
    const rgb = color.rgb().unitObject();
    const r = Math.floor(rgb.r * 100);
    const g = Math.floor(rgb.g * 100);
    const b = Math.floor(rgb.b * 100);
    return { r, g, b };
  },
  monaRGBToHex({ r, g, b }: MonaRGB) {
    const r256 = Math.floor((r * 255) / 100);
    const g256 = Math.floor((g * 255) / 100);
    const b256 = Math.floor((b * 255) / 100);
    let color;
    try {
      color = Color({ r: r256, g: g256, b: b256 });
    } catch (error) {
      color = Color("#FFFFFF");
    }
    return color.hex();
  },
  monaRGBToCSS({ r, g, b }: MonaRGB, alpha: number) {
    const r256 = Math.floor((r * 255) / 100);
    const g256 = Math.floor((g * 255) / 100);
    const b256 = Math.floor((b * 255) / 100);
    let color;
    try {
      color = Color({ r: r256, g: g256, b: b256, alpha });
    } catch (error) {
      color = Color("#FFFFFF");
    }
    return color.rgb().string();
  },
  isDarkColor(color: string) {
    const currentColor = Color(color);
    return currentColor.isDark();
  },
};
