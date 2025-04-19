module.exports = {
  root: true,
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    requireConfigFile: false,
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: ["react"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // 💥 Catch unused variables like 'session' and 'next'
    "no-unused-vars": [
      "warn",
      { vars: "all", args: "after-used", ignoreRestSiblings: true },
    ],

    // 💔 Prevent creating multiple GoTrueClient (or similar) instances
    "no-new": "warn",

    // 🔥 Catch incorrect JSX element usage
    "react/jsx-no-undef": ["error", { allowGlobals: true }],

    // 🔍 Help catch missing or incorrect imports
    "react/react-in-jsx-scope": "off", // Only needed for older React versions (<17)
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "warn",

    // ✨ Good practice suggestions
    "react/prop-types": "off", // Disable if not using PropTypes
    "react/display-name": "off", // Optional: Turn on if you want better stack traces
  },
};
