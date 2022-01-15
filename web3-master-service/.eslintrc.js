module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  globals: {
    Moralis: 'readonly',
    document: 'readonly',
    CLOUD_ENV: 'readonly'
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 13
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never']
  }
}
