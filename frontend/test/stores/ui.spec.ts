import { setActivePinia } from "pinia";
import { useUIStore } from "@/stores/ui";
import { createTestingPinia } from "@pinia/testing";

const testingPinia = createTestingPinia({});

describe("useUIStore", () => {
  beforeEach(() => {
    setActivePinia(testingPinia);
  });

  it("width should be return  1000", () => {
    expect.assertions(1);
    const uiStore = useUIStore();
    const width = uiStore.width;
    expect(width).toBe(1000);
  });

  it("height should be return  500", () => {
    expect.assertions(1);
    const uiStore = useUIStore();
    const height = uiStore.height;
    expect(height).toBe(500);
  });

  it("bottomBarHeight should be return 50", () => {
    expect.assertions(1);
    const uiStore = useUIStore();
    const bottomBarHeight = uiStore.bottomBarHeight;
    expect(bottomBarHeight).toBe(50);
  });

  it("isLogVisble should be return false", () => {
    expect.assertions(1);
    const uiStore = useUIStore();
    const isLogVisible = uiStore.isLogVisible;
    expect(isLogVisible).toBeFalsy();
  });

  it.each([
    [false, "#d9d5da"],
    [true, "black"],
  ])("with isDarkMode=%s, backgroundColor should be %s", (isDarkMode, expectedBackgroundColor) => {
    expect.assertions(1);
    const testingPinia = createTestingPinia({
      initialState: {
        setting: { isDarkMode },
      },
    });
    setActivePinia(testingPinia);
    const uiStore = useUIStore();
    expect(uiStore.backgroundColor).toBe(expectedBackgroundColor);
  });

  it.each([
    [false, "#d9d5da"],
    [true, "black"],
  ])("with isDarkMode=%s, backgroundColor should be %s", (isDarkMode, expectedBackgroundColor) => {
    expect.assertions(1);
    const testingPinia = createTestingPinia({
      initialState: {
        setting: { isDarkMode },
      },
    });
    setActivePinia(testingPinia);

    const uiStore = useUIStore();
    expect(uiStore.backgroundColor).toBe(expectedBackgroundColor);
  });

  it.each([
    [false, "white"],
    [true, "#121212"],
  ])(
    "with isDarkMode=%s, panelBackgroundColor should be %s",
    (isDarkMode, expectedPanelBackgroundColor) => {
      expect.assertions(1);
      const testingPinia = createTestingPinia({
        initialState: {
          setting: { isDarkMode },
        },
      });
      setActivePinia(testingPinia);

      const uiStore = useUIStore();
      expect(uiStore.panelBackgroundColor).toBe(expectedPanelBackgroundColor);
    },
  );

  it.each([
    [false, "#dcdcdc"],
    [true, "#3A3A3A"],
  ])(
    "with isDarkMode=%s, grayBackgroundColor should be %s",
    (isDarkMode, expectedGreylBackgroundColor) => {
      expect.assertions(1);
      const testingPinia = createTestingPinia({
        initialState: {
          setting: { isDarkMode },
        },
      });
      setActivePinia(testingPinia);

      const uiStore = useUIStore();
      expect(uiStore.greyBackgroundColor).toBe(expectedGreylBackgroundColor);
    },
  );
});
