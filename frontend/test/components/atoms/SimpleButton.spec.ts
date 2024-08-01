import SimpleButton from "@/components/atoms/SimpleButton.vue";
import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";

describe("SimpleButton", () => {
  const getCommonMountOption = (props?: object) => ({
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      title: "ボタン",
      ...props,
    },
  });

  describe("props", () => {
    it("should render the component", () => {
      const wrapper = mount(SimpleButton, {
        ...getCommonMountOption(),
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.get("span").text()).toBe("ボタン");
      expect(wrapper.get("button").classes()).toContain("light");
    });

    it("should render the component with dark style", () => {
      const wrapper = mount(SimpleButton, {
        ...getCommonMountOption({
          isDark: true,
        }),
      });
      expect(wrapper.get("button").classes()).toContain("dark");
    });

    it("should render the component with disabled style", () => {
      const wrapper = mount(SimpleButton, {
        ...getCommonMountOption({
          disabled: true,
        }),
      });
      expect(wrapper.get("button").attributes()).toEqual(expect.objectContaining({ disabled: "" }));
    });

    it("should render the component with dark style from store", () => {
      const wrapper = mount(SimpleButton, {
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
      expect(wrapper.get("button").classes()).toContain("dark");
    });
  });

  describe("@click", () => {
    it("should emit event when button is clicked", async () => {
      const wrapper = mount(SimpleButton, {
        ...getCommonMountOption(),
      });
      await wrapper.find("button").trigger("click");
      expect(wrapper.emitted("click")).toHaveLength(1);
    });
  });
});
