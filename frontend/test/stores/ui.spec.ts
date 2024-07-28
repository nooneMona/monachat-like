import { createPinia, setActivePinia } from "pinia";
import { useUIStore } from "@/stores/ui";

const useSettingStore = vi.hoisted(() =>
  vi.fn(() => {
    return { isDarkMode: false };
  }),
);

vi.mock("@/stores/setting", () => ({ useSettingStore }));

describe("useUIStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("width should be return  1000", () => {
    const uiStore = useUIStore();
    const width = uiStore.width;
    expect(width).toBe(1000);
  });

  it("height should be return  500", () => {
    const uiStore = useUIStore();
    const height = uiStore.height;
    expect(height).toBe(500);
  });

  it("bottomBarHeight should be return 50", () => {
    const uiStore = useUIStore();
    const bottomBarHeight = uiStore.bottomBarHeight;
    expect(bottomBarHeight).toBe(50);
  });

  it("isLogVisble should be return false", () => {
    const uiStore = useUIStore();
    const isLogVisible = uiStore.isLogVisible;
    expect(isLogVisible).toBe(false);
  });

  it("backgroundColor should be return #d9d5da when isDarkMode is false", () => {
    useSettingStore.mockReturnValue({ isDarkMode: false });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.backgroundColor;
    expect(backgroundColor).toBe("#d9d5da");
  });

  it("backgroundColor should be return black when isDarkMode is true", () => {
    useSettingStore.mockReturnValue({ isDarkMode: true });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.backgroundColor;
    expect(backgroundColor).toBe("black");
  });

  it("panelBackgroundColor should be return white when isDarkMode is false", () => {
    useSettingStore.mockReturnValue({ isDarkMode: false });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.panelBackgroundColor;
    expect(backgroundColor).toBe("white");
  });

  it("panelBackgroundColor  should be return #121212 when isDarkMode is true", () => {
    useSettingStore.mockReturnValue({ isDarkMode: true });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.panelBackgroundColor;
    expect(backgroundColor).toBe("#121212");
  });

  it("greyBackgroundColor should be return white when isDarkMode is false", () => {
    useSettingStore.mockReturnValue({ isDarkMode: false });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.greyBackgroundColor;
    expect(backgroundColor).toBe("#dcdcdc");
  });

  it("greyBackgroundColor  should be return #121212 when isDarkMode is true", () => {
    useSettingStore.mockReturnValue({ isDarkMode: true });
    const uiStore = useUIStore();
    const backgroundColor = uiStore.greyBackgroundColor;
    expect(backgroundColor).toBe("#3A3A3A");
  });
});
