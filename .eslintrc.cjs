/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/.turbo/**",
    "**/.vite/**",
  ],
  overrides: [
    {
      files: [
        ".github/actions/**/*.js",
        "resume/resolve-resume.js",
        "resume/**/*.js",
      ],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["resume/theme/**/*.{js,jsx,ts,tsx}"],
      env: {
        browser: true,
        node: false,
      },
      parserOptions: {
        sourceType: "module",
      },
    },
  ],
};
