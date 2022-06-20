module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/typescript',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
  },
};
