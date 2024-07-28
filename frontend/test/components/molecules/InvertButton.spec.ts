import InvertButton from "@/components/molecules/InvertButton.vue";
import { mount } from "@vue/test-utils";

describe("InvertButton", () => {
  it("should render correctly", () => {
    const wrapper = mount(InvertButton);

    expect(wrapper.element.tagName).toBe("IMG");
    expect(wrapper.attributes()).toEqual(
      expect.objectContaining({ src: "/img/invert.svg", alt: "反転" }),
    );
  });

  it("@click", () => {
    const wrapper = mount(InvertButton);

    wrapper.trigger("click");
    expect(wrapper.emitted("click")).toEqual([[]]);
  });
});
