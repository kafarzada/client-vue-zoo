module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-param-reassign': 'off',
    'linebreak-style': ['error', 'windows'],
    'vue/html-quotes': ['error', 'single', {
      avoidEscape: false,
    }],
    'func-names': ['error', 'as-needed'],
  },
};
