import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Ignore build outputs and dependencies
  {
    ignores: ['node_modules', 'dist', 'build', 'coverage', 'example'],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,

  // Apply to TypeScript files in src/ (with typed linting)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
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

  // Config and test files - no typed linting (not in tsconfig.json)
  {
    files: ['*.config.{js,ts,mjs}', 'test.ts'],
    languageOptions: {
      parser: tseslint.parser,
      // No parserOptions.project - these files aren't in tsconfig.json
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
];
