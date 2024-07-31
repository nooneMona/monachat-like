import SeekBar from "@/components/molecules/SeekBar.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("SeekBar", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      sequence: ["A", "B", "C", "D", "E"],
      index: 2,
      ...props,
    },
  });

  it("should render correctly", () => {
    const wrapper = mount(SeekBar, {
      ...getCommonMountOption(),
    });

    expect(wrapper.classes()).toContain("seekbar");
    expect(wrapper.findAll("button")[0]?.text()).toBe("◀");
    expect(wrapper.findAll("button")[1]?.text()).toBe("▶");
    expect(wrapper.find("input").element.type).toBe("range");
  });

  it("should change index when buttons clicked", async () => {
    const wrapper = mount(SeekBar, {
      ...getCommonMountOption(),
    });

    await wrapper.findAll("button")[1]?.trigger("click");
    expect(wrapper.emitted("update:index")).toEqual([[3]]);

    await wrapper.findAll("button")[0]?.trigger("click");
    expect(wrapper.emitted("update:index")).toEqual([[3], [1]]);
  });

  it("shouldn't change index when starts with index 0", async () => {
    const wrapper = mount(SeekBar, {
      ...getCommonMountOption({ index: 0 }),
    });

    await wrapper.findAll("button")[0]?.trigger("click");
    expect(wrapper.emitted("update:index")).toBeUndefined();
  });

  it("shouldn't change index when starts with index max value", async () => {
    const wrapper = mount(SeekBar, {
      ...getCommonMountOption({ index: 4 }),
    });

    await wrapper.findAll("button")[1]?.trigger("click");
    expect(wrapper.emitted("update:index")).toBeUndefined();
  });

  it("shouldn't change index when starts with index infinity", async () => {
    const wrapper = mount(SeekBar, {
      ...getCommonMountOption({ index: Number.POSITIVE_INFINITY }),
    });

    await wrapper.findAll("button")[1]?.trigger("click");
    expect(wrapper.emitted("update:index")).toBeUndefined();
  });
});
