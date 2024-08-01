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
    expect.assertions(2);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submit")).toStrictEqual([[{ shift: false, text: "こんにちは" }]]);
    expect(wrapper.emitted("update:modelValue")).toStrictEqual([["こんにちは"], [""]]);
  });

  it("@submit with shift key", () => {
    expect.assertions(1);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    wrapper.find("button").trigger("click", { shiftKey: true });
    expect(wrapper.emitted("submit")).toStrictEqual([[{ shift: true, text: "こんにちは" }]]);
  });

  it("@submit with empty text (not allowedEmpty)", () => {
    expect.assertions(1);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption({ allowedEmpty: false }),
    });

    wrapper.find("input").setValue("");
    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("submit")).toBeUndefined();
  });

  it("@typed", () => {
    expect.assertions(1);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });
    wrapper.find("input").trigger("keydown", {
      key: "a",
    });
    expect(wrapper.emitted("typed")).toStrictEqual([["a"]]);
  });

  it("@delete-all", async () => {
    expect.assertions(2);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
    });

    wrapper.find("input").setValue("こんにちは");
    await flushPromises();
    expect(wrapper.emitted("delete-all")).toBeUndefined();
    wrapper.find("input").setValue("");
    await flushPromises();
    expect(wrapper.emitted("delete-all")).toStrictEqual([[]]);
  });

  it("#focus", () => {
    expect.assertions(1);
    const wrapper = mount(SubmittableField, {
      ...getCommonMountOption(),
      attachTo: document.body, // NOTE: document.bodyにアタッチしないとfocusのテストができない。
    });

    wrapper.vm.focus();
    expect(wrapper.find("input").element).toBe(document.activeElement);
  });
});
