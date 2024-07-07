import { setup } from '@storybook/vue3'
import { piniaInstance } from '../src/piniaInstance'

setup((app) => {
  app.use(piniaInstance)
})

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}