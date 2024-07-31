import SwitchField from "@/components/molecules/SwitchField.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("SwitchField", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      label: "電源",
      labelId: "power",
      modelValue: false,
      ...props,
    },
  });

  it("should render label", () => {
    const wrapper = mount(SwitchField, {
      ...getCommonMountOption(),
    });

    expect(wrapper.find("label").text()).toBe("電源");
  });

  it("should emit @update:modelValue false->true", async () => {
    const wrapper = mount(SwitchField, {
      ...getCommonMountOption({ modelValue: false }),
    });

    await wrapper.find("input").setValue(true);
    expect(wrapper.emitted("update:modelValue")).toEqual([[true]]);
  });

  it("should emit @update:modelValue true->false", async () => {
    const wrapper = mount(SwitchField, {
      ...getCommonMountOption({ modelValue: true }),
    });

    await wrapper.find("input").setValue(false);
    expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
  });
});
