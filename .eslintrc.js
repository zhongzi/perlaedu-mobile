module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "off" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-parsing-error": [
      "error",
      {
        "control-character-in-input-stream": false,
      },
    ],
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        mocha: true,
      },
    },
  ],
  ignorePatterns: ["src/view/layout/ui/*"],
};
