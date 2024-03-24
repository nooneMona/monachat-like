import InvertButton from "./InvertButton.vue";

export default {
  title: "molecules/InvertButton",
  component: InvertButton,
};

const Template: any = (args: any) => ({
  components: { InvertButton },
  setup() {
    return { args };
  },
  template: `<InvertButton v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = {};
