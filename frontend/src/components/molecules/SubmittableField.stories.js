import SubmittableField from "./SubmittableField.vue";

export default {
  title: "molecules/SubmittableField",
  component: SubmittableField,
};

const Template = (args) => ({
  components: { SubmittableField },
  setup() {
    return { args };
  },
  template: `<SubmittableField v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = {};
