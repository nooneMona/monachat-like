import { ref } from "vue";
import { StoryFn } from "@storybook/vue3";
import Dropdown from "./MonaDropdown.vue";

export default {
  title: "Molecules/MonaDropdown",
  component: Dropdown,
};

interface Args {
  title: string;
  options: { value: string; text: string }[];
  isDark?: boolean;
}

const Template: StoryFn<Args> = (args) => ({
  components: { Dropdown },
  setup() {
    const index = ref(2);
    return { args, index };
  },
  template: `<Dropdown v-bind="args" v-model:index="index" />`,
});

export const Normal = Template.bind({});
Normal.args = {
  title: "血液型",
  options: [
    { value: "a", text: "A型" },
    { value: "b", text: "B型" },
    { value: "o", text: "O型" },
    { value: "ab", text: "AB型" },
  ],
};

export const Dark = Template.bind({});
Dark.args = {
  ...Normal.args,
  isDark: true,
};
