import SpanText from "./SpanText.vue";

export default {
  title: "atoms/SpanText",
  component: SpanText,
};

const Template = (args) => ({
  components: { SpanText },
  setup() {
    return { args };
  },
  template: `<SpanText v-bind="args" />`,
});

export const Text = Template.bind({});
Text.args = { text: "こんばんは" };

export const Black = Template.bind({});
Black.args = { text: "黒いこんばんは", type: "black" };

export const White = Template.bind({});
White.args = { text: "白いこんばんは", type: "white" };

export const Notice = Template.bind({});
Notice.args = { text: "赤いこんばんは", type: "notice" };

export const Size = Template.bind({});
Size.args = { text: "大きい文字", size: "20" };
