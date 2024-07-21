import SpanText from "@/components/atoms/SpanText.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("SpanText", () => {
  it("should render correctly", () => {
    const wrapper = mount(SpanText, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        text: "Hello World",
      },
    });

    expect(wrapper.text()).toBe("Hello World");
    expect(wrapper.attributes()).toEqual(expect.objectContaining({ style: "color: black;" }));
  });

  it("should render the component with dark style", () => {
    const wrapper = mount(SpanText, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        text: "Hello World",
        isDark: true,
      },
    });

    expect(wrapper.attributes()).toEqual(expect.objectContaining({ style: "color: white;" }));
  });

  it("should render the component with dark style from store", () => {
    const wrapper = mount(SpanText, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              setting: { isDarkMode: true },
            },
          }),
        ],
      },
      props: {
        text: "Hello World",
      },
    });

    expect(wrapper.attributes()).toEqual(expect.objectContaining({ style: "color: white;" }));
  });

  it("should render the component with color type", () => {
    const wrapper = mount(SpanText, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        text: "Hello World",
        type: "notice",
      },
    });

    expect(wrapper.attributes()).toEqual(expect.objectContaining({ style: "color: red;" }));
  });

  it("should render the component with text size", () => {
    const wrapper = mount(SpanText, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        text: "Hello World",
        size: 20,
      },
    });

    expect(wrapper.attributes()).toEqual(
      expect.objectContaining({ style: "color: black; font-size: 20px;" }),
    );
  });
});
