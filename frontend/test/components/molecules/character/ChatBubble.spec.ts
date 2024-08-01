import ChatBubble, { Message } from "@/components/molecules/character/ChatBubble.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("ChatBubble", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      msg: {
        cmt: "こんにちは",
        style: 1,
      } satisfies Message,
      color: "#ffffff",
      ...props,
    },
  });

  it("should render correctly", () => {
    expect.assertions(6);
    const wrapper = mount(ChatBubble, {
      ...getCommonMountOption(),
    });
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("bubble");
    expect(wrapper.classes()).toContain("bubble--normal");
    expect(wrapper.classes()).toContain("light");
    expect(spanText.text()).toBe("こんにちは");
    expect(spanText.attributes().style).toBe("color: black;");
    expect((wrapper.vm as any).borderColor).toBe("black");
  });

  it("should render correctly with dark mode", () => {
    expect.assertions(6);
    const wrapper = mount(ChatBubble, {
      ...getCommonMountOption({ isDark: true }),
    });
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("bubble");
    expect(wrapper.classes()).toContain("bubble--normal");
    expect(wrapper.classes()).toContain("dark");
    expect(spanText.text()).toBe("こんにちは");
    expect(spanText.attributes().style).toBe("color: black;");
    expect((wrapper.vm as any).borderColor).toBe("white");
  });

  it("should render correctly with dark by store", () => {
    expect.assertions(6);
    const wrapper = mount(ChatBubble, {
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

    expect(wrapper.classes()).toContain("bubble");
    expect(wrapper.classes()).toContain("bubble--normal");
    expect(wrapper.classes()).toContain("dark");
    expect(spanText.text()).toBe("こんにちは");
    expect(spanText.attributes().style).toBe("color: black;");
    expect((wrapper.vm as any).borderColor).toBe("white");
  });

  it("should render correctly with style 2", () => {
    expect.assertions(5);
    const wrapper = mount(ChatBubble, {
      ...getCommonMountOption({
        msg: {
          cmt: "こんにちは",
          style: 2,
        },
      }),
    });
    const spanText = wrapper.find("span");

    expect(wrapper.classes()).toContain("bubble");
    expect(wrapper.classes()).toContain("bubble--thinking");
    expect(wrapper.classes()).toContain("light");
    expect(spanText.text()).toBe("こんにちは");
    expect(spanText.attributes().style).toBe("color: black;");
  });
});
