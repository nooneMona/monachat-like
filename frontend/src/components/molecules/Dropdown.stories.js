import { ref } from "vue";
import Dropdown from "./Dropdown.vue";

export default {
  title: "Molecules/Dropdown",
  component: Dropdown,
};

const Template = (args) => ({
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
  title: "血液型",
  options: [
    { value: "a", text: "A型" },
    { value: "b", text: "B型" },
    { value: "o", text: "O型" },
    { value: "ab", text: "AB型" },
  ],
  isDark: true,
};
