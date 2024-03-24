export default {
  viteFinal: async (config, options) => {
    return config;
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-actions",
  ],
  framework: "@storybook/vue3-vite",
  core: {
    builder: "@storybook/builder-vite",
  },
};
