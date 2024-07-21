import TextField from "@/components/atoms/TextField.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("TextField", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      ...props,
    },
  });

  it("should render correctly", () => {
    const wrapper = mount(TextField, {
      ...getCommonMountOption(),
    });
    expect(wrapper.find("input")).toBeTruthy();
    expect(wrapper.get("input").classes()).toContain("light");
  });

  it("should render with dark style", () => {
    const wrapper = mount(TextField, {
      ...getCommonMountOption({
        isDark: true,
      }),
    });
    expect(wrapper.get("input").classes()).toContain("dark");
  });

  it("should render with dark style by store", () => {
    const wrapper = mount(TextField, {
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
    expect(wrapper.get("input").classes()).toContain("dark");
  });

  it("set value", () => {
    const wrapper = mount(TextField, {
      ...getCommonMountOption(),
    });
    wrapper.find("input").setValue("こんにちは");
    expect(wrapper.emitted("update:modelValue")).toEqual([["こんにちは"]]);
  });

  it("@typed", () => {
    const wrapper = mount(TextField, {
      ...getCommonMountOption(),
    });
    wrapper.find("input").trigger("keydown", {
      key: "a",
    });
    expect(wrapper.emitted("typed")).toEqual([["a"]]);
  });

  it("#focus", () => {
    const wrapper = mount(TextField, {
      ...getCommonMountOption(),
      attachTo: document.body, // NOTE: document.bodyにアタッチしないとfocusのテストができない。
    });
    wrapper.vm.focus();
    expect(wrapper.get("input").element).toEqual(document.activeElement);
  });
});
