import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    files: ['scripts/**'],
    languageOptions: { globals: { URL: 'readonly' } },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
    },
  }
);
