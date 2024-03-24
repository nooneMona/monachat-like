module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/airbnb",
    "@vue/prettier",
    "plugin:storybook/recommended",
  ],
  rules: {
    "no-console": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": import.meta.env.NODE_ENV === "production" ? "warn" : "off",
    "func-names": "off",
    "vuejs-accessibility/label-has-for": "off",
    // よくわからないので
    "vuejs-accessibility/form-control-has-label": "off",
    // よくわからないので
    "vue/multi-word-component-names": "off", // 性善説に期待します。
    "import/prefer-default-export": "off",
    "vue/no-v-model-argument": "off", // v-modelは複数あってもいいと思ってるので。
    "import/no-cycle": "off", // vue-routerとvuexを共存させるのに必要
  },
};
