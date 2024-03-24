import Bubble from "./Bubble.vue";

export default {
  title: "molecules/character/Bubble",
  component: Bubble,
};

const Template = (args) => ({
  components: { Bubble },
  setup() {
    return { args };
  },
  template: `<Bubble v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = { msg: { cmt: "はいこん", style: 1 }, color: "#ff0000" };

export const Thinking = Template.bind({});
Thinking.args = { msg: { cmt: "はいこん", style: 2 }, color: "#ff0000" };

export const Empty = Template.bind({});
Empty.args = { msg: { cmt: "", style: 1 }, color: "#ff0000" };

export const LightColor = Template.bind({});
LightColor.args = { msg: { cmt: "はいこん", style: 1 }, color: "#ffffff" };

export const DarkMode = Template.bind({});
DarkMode.args = { msg: { cmt: "はいこん", style: 1 }, color: "#ff0000", isDark: true };
