import SubmittableField from "@/components/molecules/SubmittableField.vue";
import { flushPromises, mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

describe("SubmittableField", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      ...props,
    },
  });

  it("@submit", () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submit")).toEqual([[{ shift: false, text: "こんにちは" }]]);
    expect(wrapper.emitted("update:modelValue")).toEqual([["こんにちは"], [""]]);
  });

  it("@submit with shift key", () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    wrapper.find("button").trigger("click", { shiftKey: true });
    expect(wrapper.emitted("submit")).toEqual([[{ shift: true, text: "こんにちは" }]]);
  });

  it("@submit with empty text (not allowedEmpty)", () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption({ allowedEmpty: false }),
    });

    wrapper.find("input").setValue("");
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("@typed", () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });
    wrapper.find("input").trigger("keydown", {
      key: "a",
    });
    expect(wrapper.emitted("typed")).toEqual([["a"]]);
  });

  it("@delete-all", async () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    await flushPromises();
    expect(wrapper.emitted("delete-all")).toBeUndefined();
    wrapper.find("input").setValue("");
    await flushPromises();
    expect(wrapper.emitted("delete-all")).toEqual([[]]);
  });

  it("#focus", () => {
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
      attachTo: document.body, // NOTE: document.bodyにアタッチしないとfocusのテストができない。
    });

    wrapper.vm.focus();
    expect(wrapper.find("input").element).toBe(document.activeElement);
  });
});
