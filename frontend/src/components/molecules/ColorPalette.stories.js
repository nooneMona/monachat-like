import ColorPalette from "./ColorPalette.vue";

export default {
  title: "molecules/ColorPalette",
  component: ColorPalette,
};

const Template = (args) => ({
  components: { ColorPalette },
  setup() {
    return { args };
  },
  template: `
    <div :style="{width: '59px', height: '236px'}">
      <ColorPalette v-bind="args" />
    </div>
  `,
});

const hexColors = [
  { id: "1", hexColor: "#FFFFFF" },
  { id: "2", hexColor: "#FFFFE5" },
  { id: "3", hexColor: "#FFFFB2" },
  { id: "4", hexColor: "#FFFF66" },
  { id: "5", hexColor: "#FFE5FF" },
  { id: "6", hexColor: "#FFE5E5" },
  { id: "7", hexColor: "#FFE5B2" },
  { id: "8", hexColor: "#FFE566" },
  { id: "9", hexColor: "#FFB2FF" },
  { id: "10", hexColor: "#FFB2E5" },
  { id: "11", hexColor: "#FFB2B2" },
  { id: "12", hexColor: "#FFB266" },
  { id: "13", hexColor: "#FF66FF" },
  { id: "14", hexColor: "#FF66E5" },
  { id: "15", hexColor: "#FF66B2" },
  { id: "16", hexColor: "#FF6666" },
  { id: "17", hexColor: "#E5FFFF" },
  { id: "18", hexColor: "#E5FFE5" },
  { id: "19", hexColor: "#E5FFB2" },
  { id: "20", hexColor: "#E5FF66" },
  { id: "21", hexColor: "#E5E5FF" },
  { id: "22", hexColor: "#E5E5E5" },
  { id: "23", hexColor: "#E5E5B2" },
  { id: "24", hexColor: "#E5E566" },
  { id: "25", hexColor: "#E5B2FF" },
  { id: "26", hexColor: "#E5B2E5" },
  { id: "27", hexColor: "#E5B2B2" },
  { id: "28", hexColor: "#E5B266" },
  { id: "29", hexColor: "#E566FF" },
  { id: "30", hexColor: "#E566E5" },
  { id: "31", hexColor: "#E566B2" },
  { id: "32", hexColor: "#E56666" },
  { id: "33", hexColor: "#B2FFFF" },
  { id: "34", hexColor: "#B2FFE5" },
  { id: "35", hexColor: "#B2FFB2" },
  { id: "36", hexColor: "#B2FF66" },
  { id: "37", hexColor: "#B2E5FF" },
  { id: "38", hexColor: "#B2E5E5" },
  { id: "39", hexColor: "#B2E5B2" },
  { id: "40", hexColor: "#B2E566" },
  { id: "41", hexColor: "#B2B2FF" },
  { id: "42", hexColor: "#B2B2E5" },
  { id: "43", hexColor: "#B2B2B2" },
  { id: "44", hexColor: "#B2B266" },
  { id: "45", hexColor: "#B266FF" },
  { id: "46", hexColor: "#B266E5" },
  { id: "47", hexColor: "#B266B2" },
  { id: "48", hexColor: "#B26666" },
  { id: "49", hexColor: "#66FFFF" },
  { id: "50", hexColor: "#66FFE5" },
  { id: "51", hexColor: "#66FFB2" },
  { id: "52", hexColor: "#66FF66" },
  { id: "53", hexColor: "#66E5FF" },
  { id: "54", hexColor: "#66E5E5" },
  { id: "55", hexColor: "#66E5B2" },
  { id: "56", hexColor: "#66E566" },
  { id: "57", hexColor: "#66B2FF" },
  { id: "58", hexColor: "#66B2E5" },
  { id: "59", hexColor: "#66B2B2" },
  { id: "60", hexColor: "#66B266" },
  { id: "61", hexColor: "#6666FF" },
  { id: "62", hexColor: "#6666E5" },
  { id: "63", hexColor: "#6666B2" },
  { id: "64", hexColor: "#666666" },
];

export const Normal = Template.bind({});
Normal.args = {
  hexColors,
};

export const Dark = Template.bind({});
Dark.args = {
  hexColors,
  isDark: true,
};
