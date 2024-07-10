import { ref } from "vue";
import SeekBar from "./SeekBar.vue";

export default {
  title: "molecules/SeekBar",
  component: SeekBar,
};

const Template = (args) => ({
  components: { SeekBar },
  setup() {
    const index = ref(2);
    return { args, index };
  },
  template: `<SeekBar v-bind="args" v-model:index="index" />`,
});

export const Normal = Template.bind({});
Normal.args = { sequence: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] };
