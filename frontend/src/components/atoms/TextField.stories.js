import { ref } from "vue";
import TextField from "./TextField.vue";

export default {
  title: "atoms/TextField",
  component: TextField,
};

const Template = (args) => ({
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
