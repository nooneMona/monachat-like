import { StoryFn } from "@storybook/vue3";
import SubmittableField from "./SubmittableField.vue";

export default {
  title: "molecules/SubmittableField",
  component: SubmittableField,
};

interface Args {
  allowedEmpty: boolean;
  disabled: boolean;
}

const Template: StoryFn<Args> = (args) => ({
  components: { SubmittableField },
  setup() {
    return { args };
  },
  template: `<SubmittableField v-bind="args" />`,
});

export const Normal = Template.bind({});
Normal.args = {};

export const AllowedEmpty = Template.bind({});
AllowedEmpty.args = { allowedEmpty: true };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };
