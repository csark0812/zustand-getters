import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Ignore build outputs and dependencies
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', 'example/dist', 'example/node_modules'],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // Apply to all TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
    },
  },

  // Config files can use console and don't need strict rules
  {
    files: ['*.config.{js,ts,mjs}', 'test.ts'],
    rules: {
      'no-console': 'off',
    },
  },
];
