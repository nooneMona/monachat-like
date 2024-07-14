import { ref } from "vue";
import { StoryFn } from "@storybook/vue3";
import TextField from "./TextField.vue";

export default {
  title: "atoms/TextField",
  component: TextField,
};

interface Args {
  text: string;
  isDark?: boolean;
}

const Template: StoryFn<Args> = (args) => ({
  components: { TextField },
  setup() {
    const value = ref("テキスト");
    return { args, value };
  },
  template: `<TextField v-bind="args" v-model="value" :style="{width: '300px'}" />`,
});

export const Text = Template.bind({});
Text.args = { text: "こんばんは" };

export const Black = Template.bind({});
Black.args = { text: "黒いこんばんは", isDark: true };
