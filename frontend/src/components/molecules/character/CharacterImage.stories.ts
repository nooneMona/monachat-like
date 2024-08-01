import { StoryFn } from "@storybook/vue3";
import CharacterImage from "./CharacterImage.vue";
import { ChatCharacterUser } from "../../../domain/type";

export default {
  title: "molecules/character/CharacterImage",
  component: CharacterImage,
};

interface Args {
  user: Pick<ChatCharacterUser, "type" | "scl" | "hexValue">;
  depthRate: number;
  isKBMode: boolean;
  isSilent: boolean;
}

const Template: StoryFn<Args> = (args) => ({
  components: { CharacterImage },
  setup() {
    return { args };
  },
  template: `<CharacterImage v-bind="args" />`,
});

export const Mona = Template.bind({});
Mona.args = {
  user: { type: "mona", scl: 100, hexValue: "#ffffff" },
  depthRate: 1,
  isKBMode: false,
  isSilent: false,
};

export const Reverse = Template.bind({});
Reverse.args = {
  ...Mona.args,
  user: { type: "mona", scl: -100, hexValue: "#ffffff" },
};

export const Red = Template.bind({});
Red.args = {
  ...Mona.args,
  user: { type: "mona", scl: 100, hexValue: "#ff0000" },
};

export const Small = Template.bind({});
Small.args = {
  ...Mona.args,
  depthRate: 0.5,
};

export const KB = Template.bind({});
KB.args = {
  ...Mona.args,
  isKBMode: true,
};

export const Silent = Template.bind({});
Silent.args = {
  ...Mona.args,
  isSilent: true,
};
