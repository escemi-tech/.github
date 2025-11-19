import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import nPlugin from "eslint-plugin-n";

const typescriptConfigs = tseslint.configs["flat/recommended"].map(
  (config) => ({
    ...config,
    files: ["resume/theme/**/*.{ts,tsx}"],
    languageOptions: {
      ...config.languageOptions,
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2023,
      },
      parserOptions: {
        ...(config.languageOptions?.parserOptions ?? {}),
        project: false,
        ecmaFeatures: {
          ...(config.languageOptions?.parserOptions?.ecmaFeatures ?? {}),
          jsx: true,
        },
      },
    },
    plugins: {
      ...(config.plugins ?? {}),
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      n: nPlugin,
    },
    settings: {
      ...(config.settings ?? {}),
      react: {
        version: "detect",
      },
    },
    rules: {
      ...(config.rules ?? {}),
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "n/no-missing-import": "off",
      "n/no-unpublished-import": "off",
    },
  })
);

const nodeModuleScriptsConfig = {
  files: [".github/actions/humanize-resume/**/*.js"],
  languageOptions: {
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    n: nPlugin,
  },
};

const nodeCommonJsScriptsConfig = {
  files: [".github/actions/generate-resume-pdf/**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.node,
      ...globals.commonjs,
    },
  },
  plugins: {
    n: nPlugin,
  },
};

export default [
  {
    ignores: [
      "node_modules/**",
      "resume/theme/dist/**",
      ".github/actions/**/node_modules/**",
    ],
  },
  js.configs.recommended,
  nodeModuleScriptsConfig,
  nodeCommonJsScriptsConfig,
  ...typescriptConfigs,
];
