import Button from "./Button.vue";
import { StoryFn } from "@storybook/vue3";

export default {
  title: "atoms/Button",
  component: Button,
};

interface Args {
  title: string;
  isDark: boolean;
  disabled: boolean;
  textSize: number;
}

const Template: StoryFn<Args> = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: `<Button v-bind="args" :style="{width: '100px', height: '50px'}"/>`,
});

export const OK = Template.bind({});
OK.args = { title: "OK" };

export const Dark = Template.bind({});
Dark.args = { title: "OK", isDark: true };

export const Disabled = Template.bind({});
Disabled.args = { title: "OK", disabled: true };

export const TextSize = Template.bind({});
TextSize.args = { title: "OK", textSize: 10 };
