import BubbleArea from "@/components/organisms/BubbleArea.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("BubbleArea", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      user: { y: 100, rgbaValue: "#ffffff" } as any,
      messages: [
        { messageID: "1", msg: {} },
        { messageID: "2", msg: {} },
      ] as any[],
      bubbleAreaHeight: 300,
      ...props,
    },
    stubs: ["chat-bubble", { transition: false }],
  });

  it("should render correctly", () => {
    expect.assertions(6);
    const wrapper = mount(BubbleArea, { ...getCommonMountOption() });
    expect(wrapper.classes()).toStrictEqual(["bubble-area-frame"]);
    expect(wrapper.attributes("style")).toBe("bottom: 200px; height: 300px;");
    const bubbleArea = wrapper.find(".bubble-area");
    expect(bubbleArea.exists()).toBe(true);
    expect(bubbleArea.classes()).toStrictEqual(["bubble-area"]);

    const bubbleContainers = wrapper.findAll(".bubble-container");
    expect(bubbleContainers).toHaveLength(2);
    expect(wrapper.findAllComponents({ name: "ChatBubble" })).toHaveLength(2);
  });

  it.each`
    selectedTime | expectedPeriod
    ${"quick"}   | ${"3s"}
    ${"short"}   | ${"10s"}
    ${"medium"}  | ${"20s"}
    ${"long"}    | ${"30s"}
  `(
    `should get period $selectedTime when selectedTime is $selectedTime`,
    ({ selectedTime, expectedPeriod }) => {
      expect.assertions(1);
      const wrapper = mount(BubbleArea, {
        ...getCommonMountOption(),
        global: {
          plugins: [
            createTestingPinia({
              initialState: {
                setting: { selectedTime },
              },
            }),
          ],
        },
      });
      expect((wrapper.vm as any).transitionPeriod).toBe(expectedPeriod);
    },
  );

  it.todo("@bubbleDeleted", () => {
    expect.assertions(0);
  });

  it("should render correctly when debug frame is visible", () => {
    expect.assertions(2);
    const wrapper = mount(BubbleArea, {
      ...getCommonMountOption(),
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              dev: { isVisibleFrame: true },
            },
          }),
        ],
      },
    });
    expect(wrapper.classes()).toStrictEqual(["bubble-area-frame", "debug-frame"]);
    expect(wrapper.find(".bubble-area").classes()).toStrictEqual(["bubble-area", "debug-frame"]);
  });
});
