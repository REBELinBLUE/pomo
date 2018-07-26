module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'max-len': ['error', 120],
    'no-console': 'off',
    'no-debugger': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state'
        ]
      }
    ],
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/attributes-order': 'error',
    'vue/html-indent': ['error', 2],
    'vue/html-quotes': ['error', 'double'],
    'vue/html-self-closing': 'error',
    'vue/order-in-components': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
  },
  globals: {
    '__static': true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
