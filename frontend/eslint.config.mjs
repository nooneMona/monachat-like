import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from "eslint-plugin-vitest";

// @ts-check
/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  { ignores: ["node_modules", "dist", ".storybook"] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    name: "js",
    files: ["**/*.js"],
    rules: js.configs.recommended.rules,
  },
  {
    files: ["*.ts", "**/*.ts"],
    rules: { "@typescript-eslint/strict-boolean-expressions": "error" },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { parser: tseslint.parser, sourceType: "module", project: "./tsconfig.json" },
    },
  },
  {
    files: ["*.vue", "**/*.vue"],
    rules: {
      "vue/block-lang": [
        "error",
        {
          script: {
            lang: "ts",
          },
        },
      ],
      "vue/component-api-style": ["error", ["script-setup", "composition"]],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/custom-event-name-casing": ["error", "kebab-case"],
      "vue/define-emits-declaration": ["error", "type-based"],
      "vue/define-macros-order": [
        "error",
        {
          order: ["defineProps", "defineEmits", "defineModel"],
          defineExposeLast: true,
        },
      ],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/html-comment-content-spacing": ["error", "always"],
      "vue/no-empty-component-block": ["error"],
      "vue/no-multiple-objects-in-class": ["error"],
      "vue/no-ref-object-reactivity-loss": ["off"], // if文の中で評価するときもNGになるので、、
      "vue/no-required-prop-with-default": ["error"],
      "vue/no-root-v-if": ["error"],
      "vue/no-static-inline-styles": ["error"],
      "vue/no-template-target-blank": ["warn"],
      "vue/no-undef-components": [
        "error",
        {
          ignorePatterns: ["router-view"],
        },
      ], // これのせいで不具合に気付かないことがよくあるので、必須
      "vue/no-undef-properties": ["error"],
      "vue/no-unused-emit-declarations": ["warn"],
      "vue/no-unused-properties": ["warn"],
      "vue/no-unused-refs": ["warn"],
      "vue/no-useless-v-bind": ["error"],
      "vue/no-v-text": ["error"],
      "vue/padding-line-between-blocks": ["error"],
      "vue/prefer-true-attribute-shorthand": ["error"],
      "vue/require-macro-variable-name": ["error"],
      "vue/require-typed-ref": ["error"],
      "vue/static-class-names-order": ["error"],
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, sourceType: "module" },
    },
  },
  {
    files: ["test/**/*.spec.ts"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        it: "readonly",
        describe: "readonly",
      },
    },
    rules: { ...vitest.configs.recommended.rules, "@typescript-eslint/no-explicit-any": "off" },
  },
  eslintConfigPrettier, // 一番後ろに置かないとよしなに調整してくれない。
];
