import ColorPalette, { Color } from "@/components/molecules/ColorPalette.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("ColorPalette", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      hexColors: [
        { id: 1, hexColor: "#FFFFFF" },
        { id: 2, hexColor: "#FFFFE5" },
        { id: 3, hexColor: "#FFFFB2" },
        { id: 4, hexColor: "#FFFF66" },
        { id: 5, hexColor: "#FFE5FF" },
        { id: 6, hexColor: "#FFE5E5" },
        { id: 7, hexColor: "#FFE5B2" },
        { id: 8, hexColor: "#FFE566" },
        { id: 9, hexColor: "#FFB2FF" },
        { id: 10, hexColor: "#FFB2E5" },
        { id: 11, hexColor: "#FFB2B2" },
        { id: 12, hexColor: "#FFB266" },
        { id: 13, hexColor: "#FF66FF" },
        { id: 14, hexColor: "#FF66E5" },
        { id: 15, hexColor: "#FF66B2" },
        { id: 16, hexColor: "#FF6666" },
      ] satisfies Color[],
      ...props,
    },
  });

  it("should render correctly", () => {
    expect.assertions(4);
    const wrapper = mount(ColorPalette, {
      ...getCommonMountOption(),
    });
    const colorItems = wrapper.findAll(".cell");

    expect(wrapper.classes()).toContain("color-palette");
    expect(wrapper.classes()).toContain("light");

    expect(colorItems).toHaveLength(16);
    expect(colorItems[0]?.classes()).toContain("light");
  });

  it("should change color palette to dark mode", () => {
    expect.assertions(1);
    const wrapper = mount(ColorPalette, {
      ...getCommonMountOption({ isDark: true }),
    });

    expect(wrapper.classes()).toContain("dark");
  });

  it("should change color palette to dark mode by store", () => {
    expect.assertions(1);
    const wrapper = mount(ColorPalette, {
      ...getCommonMountOption(),
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              setting: { isDarkMode: true },
            },
          }),
        ],
      },
    });

    expect(wrapper.classes()).toContain("dark");
  });

  it("@click", () => {
    expect.assertions(2);
    const wrapper = mount(ColorPalette, {
      ...getCommonMountOption(),
    });
    const colorItems = wrapper.findAll(".cell");

    colorItems[0]?.trigger("click");
    expect(wrapper.emitted("click")?.[0]).toStrictEqual(["#FFFFFF"]);
    colorItems[10]?.trigger("click");
    expect(wrapper.emitted("click")?.[1]).toStrictEqual(["#FFB2B2"]);
  });
});
