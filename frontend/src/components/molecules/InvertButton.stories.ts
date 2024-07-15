import InvertButton from "./InvertButton.vue";
import { StoryFn } from "@storybook/vue3";

export default {
  title: "molecules/InvertButton",
  component: InvertButton,
};

interface Args {}

const Template: StoryFn<Args> = (args) => ({
  components: { InvertButton },
  setup() {
    return { args };
  },
  template: `<InvertButton v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = {};
