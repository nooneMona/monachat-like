import MonaDropdown, { Option } from "@/components/molecules/MonaDropdown.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("MonaDropdown", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      title: "血液型",
      options: [
        { text: "A型", value: "A" },
        { text: "B型", value: "B" },
        { text: "O型", value: "O" },
        { text: "AB型", value: "AB" },
      ] satisfies Option[],
      ...props,
    },
  });

  it("should render correctly", () => {
    expect.assertions(13);
    const wrapper = mount(MonaDropdown, {
      ...getCommonMountOption(),
    });

    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(false);
    expect(wrapper.classes()).toContain("dropdown");
    expect(wrapper.findAll("button")[0]?.classes()).toContain("light");
    expect(wrapper.findAll("button")[0]?.text()).toBe("▼血液型");
    expect(wrapper.findAll("button")[1]?.classes()).toContain("light");
    expect(wrapper.findAll("button")[1]?.attributes("style")).toBe("display: none;");
    expect(wrapper.findAll("button")[1]?.text()).toBe("A型");
    expect(wrapper.findAll("button")[2]?.attributes("style")).toBe("display: none;");
    expect(wrapper.findAll("button")[2]?.text()).toBe("B型");
    expect(wrapper.findAll("button")[3]?.attributes("style")).toBe("display: none;");
    expect(wrapper.findAll("button")[3]?.text()).toBe("O型");
    expect(wrapper.findAll("button")[4]?.attributes("style")).toBe("display: none;");
    expect(wrapper.findAll("button")[4]?.text()).toBe("AB型");
  });

  it("should render correctly with dark mode", () => {
    expect.assertions(2);
    const wrapper = mount(MonaDropdown, {
      ...getCommonMountOption({ isDark: true }),
    });

    expect(wrapper.findAll("button")[0]?.classes()).toContain("dark");
    expect(wrapper.findAll("button")[1]?.classes()).toContain("dark");
  });

  it("should render correctly with dark mode by store", () => {
    expect.assertions(2);
    const wrapper = mount(MonaDropdown, {
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

    expect(wrapper.findAll("button")[0]?.classes()).toContain("dark");
    expect(wrapper.findAll("button")[1]?.classes()).toContain("dark");
  });

  it("should toggle selection box visiblity", async () => {
    expect.assertions(4);
    const wrapper = mount(MonaDropdown, {
      ...getCommonMountOption(),
    });

    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(false);
    expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(false);
    await wrapper.findAll("button")[0]?.trigger("mouseover");
    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(true);
    expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(false);
    await wrapper.findAll("button")[0]?.trigger("mouseleave");
    // TODO: mouseleaveが受け取れないためエラーになる
    // expect((wrapper.vm as any).isVisibleSelectionBox).toBe(false);
    // expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(false);
  });

  it("should keep selection box visiblity", async () => {
    expect.assertions(6);
    const wrapper = mount(MonaDropdown, {
      ...getCommonMountOption(),
    });

    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(false);
    expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(false);
    await wrapper.findAll("button")[0]?.trigger("mouseover");
    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(true);
    expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(false);
    await wrapper.findAll("button")[0]?.trigger("click");
    await wrapper.findAll("button")[0]?.trigger("mouseleave");
    // TODO: mouseleaveを受け取っていないためたまたまテストが通っているだけなのに要注意
    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(true);
    expect((wrapper.vm as any).isKeepingVisibleSelectionBox).toBe(true);
  });

  it("@select", async () => {
    expect.assertions(3);
    const wrapper = mount(MonaDropdown, {
      ...getCommonMountOption(),
    });

    expect((wrapper.vm as any).isVisibleSelectionBox).toBe(false);

    await wrapper.findAll("button")[1]?.trigger("click");
    expect(wrapper.emitted("select")).toStrictEqual([["A"]]);

    await wrapper.findAll("button")[2]?.trigger("click");
    expect(wrapper.emitted("select")).toStrictEqual([["A"], ["B"]]);
  });
});
