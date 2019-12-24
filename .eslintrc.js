module.exports = {
  extends: ['airbnb-base/legacy', 'plugin:flowtype/recommended', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  rules: {
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'import/prefer-default-export': 'off',
  },
  overrides: [
    {
      files: ['examples/**', '*.test.*', '**/test/**'],
      rules: {
        'flowtype/require-valid-file-annotation': 'off',
        'flowtype/no-types-missing-file-annotation': 'off',
      },
    },
  ],
  env: {
    node: true,
  },
};
