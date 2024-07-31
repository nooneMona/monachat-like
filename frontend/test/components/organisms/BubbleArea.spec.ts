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
    const wrapper = mount(BubbleArea, { ...getCommonMountOption() });
    expect(wrapper.classes()).toEqual(["bubble-area-frame"]);
    expect(wrapper.attributes("style")).toBe("bottom: 200px; height: 300px;");
    const bubbleArea = wrapper.find(".bubble-area");
    expect(bubbleArea.exists()).toBe(true);
    expect(bubbleArea.classes()).toEqual(["bubble-area"]);

    const bubbleContainers = wrapper.findAll(".bubble-container");
    expect(bubbleContainers.length).toBe(2);
    expect(wrapper.findAllComponents({ name: "ChatBubble" }).length).toBe(2);
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

  it.todo("@bubbleDeleted", () => {});

  it("should render correctly when debug frame is visible", () => {
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
    expect(wrapper.classes()).toEqual(["bubble-area-frame", "debug-frame"]);
    expect(wrapper.find(".bubble-area").classes()).toEqual(["bubble-area", "debug-frame"]);
  });
});
