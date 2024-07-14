import SimpleButton from "./SimpleButton.vue";
import { StoryFn } from "@storybook/vue3";

export default {
  title: "atoms/SimpleButton",
  component: SimpleButton,
};

interface Args {
  title: string;
  isDark: boolean;
  disabled: boolean;
  textSize: number;
}

const Template: StoryFn<Args> = (args) => ({
  components: { SimpleButton },
  setup() {
    return { args };
  },
  template: `<SimpleButton v-bind="args" :style="{width: '100px', height: '50px'}"/>`,
});

export const OK = Template.bind({});
OK.args = { title: "OK" };

export const Dark = Template.bind({});
Dark.args = { title: "OK", isDark: true };

export const Disabled = Template.bind({});
Disabled.args = { title: "OK", disabled: true };

export const TextSize = Template.bind({});
TextSize.args = { title: "OK", textSize: 10 };
