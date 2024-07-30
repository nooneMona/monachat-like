import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslintConfigPrettier from "eslint-config-prettier";

// @ts-check
/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  { ignores: ["node_modules", "dist", ".storybook"] },
  { languageOptions: { globals: globals.browser } },
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    name: "js",
    files: ["**/*.js"],
    rules: js.configs.recommended.rules,
  },
  {
    files: ["**/*.ts"],
    rules: { "@typescript-eslint/strict-boolean-expressions": "error" },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { parser: tseslint.parser, sourceType: "module", project: "./tsconfig.json" },
    },
  },
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tseslint.parser, sourceType: "module" },
    },
  },
  {
    files: ["test/**/*.spec.ts"],
    languageOptions: {
      globals: {
        it: "readonly",
        describe: "readonly",
      },
    },
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
];
