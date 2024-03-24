import Button from "./Button.vue";

export default {
  title: "atoms/Button",
  component: Button,
};

const Template = (args) => ({
  components: { Button },
  setup() {
    return { args };
  },
  template: `<Button v-bind="args" :style="{width: '100px'}"/>`,
});

export const OK = Template.bind({});
OK.args = { title: "OK" };

export const Dark = Template.bind({});
Dark.args = { title: "OK", isDark: true };
