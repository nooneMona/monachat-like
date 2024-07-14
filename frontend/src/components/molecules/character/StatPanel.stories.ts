import { StoryFn } from "@storybook/vue3";
import StatPanel from "./StatPanel.vue";

export default {
  title: "molecules/character/StatPanel",
  component: StatPanel,
};

interface Args {
  text: string;
  isDark?: boolean;
}

const Template: StoryFn<Args> = (args) => ({
  components: { StatPanel },
  setup() {
    return { args };
  },
  template: `<StatPanel v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = { text: "ﾏﾀｰﾘ" };

export const Dark = Template.bind({});
Dark.args = { text: "ﾏﾀｰﾘ", isDark: true };

export const TooLong = Template.bind({});
TooLong.args = { text: "とても長い状態のテキストです" };
