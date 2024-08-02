import StatPanel from "@/components/molecules/character/StatPanel.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("StatPanel", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      text: "こんにちは",
      ...props,
    },
  });

  it("should render correctly", () => {
    expect.assertions(2);
    const wrapper = mount(StatPanel, {
      ...getCommonMountOption(),
    });
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("light");
    expect(spanText.text()).toBe("こんにちは");
  });

  it("should render correctly with dark mode", () => {
    expect.assertions(2);
    const wrapper = mount(StatPanel, {
      ...getCommonMountOption({ isDark: true }),
    });
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("dark");
    expect(spanText.text()).toBe("こんにちは");
  });

  it("should render correctly with dark by store", () => {
    expect.assertions(2);
    const wrapper = mount(StatPanel, {
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
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("dark");
    expect(spanText.text()).toBe("こんにちは");
  });
});
