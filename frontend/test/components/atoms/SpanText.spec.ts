import SpanText from "@/components/atoms/SpanText.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("SpanText", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      text: "Hello World",
      ...props,
    },
  });

  it("should render correctly", () => {
    expect.assertions(2);
    const wrapper = mount(SpanText, {
      ...getCommonMountOption(),
    });

    expect(wrapper.text()).toBe("Hello World");
    expect(wrapper.attributes()).toStrictEqual(expect.objectContaining({ style: "color: black;" }));
  });

  it("should render the component with dark style", () => {
    expect.assertions(1);
    const wrapper = mount(SpanText, {
      ...getCommonMountOption({
        isDark: true,
      }),
    });

    expect(wrapper.attributes()).toStrictEqual(expect.objectContaining({ style: "color: white;" }));
  });

  it("should render the component with dark style from store", () => {
    expect.assertions(1);
    const wrapper = mount(SpanText, {
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

    expect(wrapper.attributes()).toStrictEqual(expect.objectContaining({ style: "color: white;" }));
  });

  it("should render the component with color type", () => {
    expect.assertions(1);
    const wrapper = mount(SpanText, {
      ...getCommonMountOption({
        type: "notice",
      }),
    });

    expect(wrapper.attributes()).toStrictEqual(expect.objectContaining({ style: "color: red;" }));
  });

  it("should render the component with text size", () => {
    expect.assertions(1);
    const wrapper = mount(SpanText, {
      ...getCommonMountOption({
        size: 20,
      }),
    });

    expect(wrapper.attributes()).toStrictEqual(
      expect.objectContaining({ style: "color: black; font-size: 20px;" }),
    );
  });
});
