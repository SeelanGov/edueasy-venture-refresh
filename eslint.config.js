import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import regexPlugin from 'eslint-plugin-regex';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'backup',
      'scripts',
      'public',
      '*.config.js',
      '*.config.ts',
      '.github',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: false,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettier,
      'unused-imports': unusedImports,
      regex: regexPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          args: 'after-used',
        },
      ],
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],

      // Color validation rules (regex-based)
      'regex/invalid': ['error', [
        { 
          regex: '#[0-9a-fA-F]{3,6}\\b', 
          message: 'Use semantic tokens (CSS vars). See docs/design-system.md' 
        },
        { 
          regex: '\\b(bg|text|border)-(red|blue|yellow|orange|slate|green|gray|emerald|stone)-[0-9]{2,3}\\b',
          message: 'Use semantic tokens, not fixed Tailwind palettes.' 
        }
      ]],

      // Design System Rules - Prevent violations
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name="className"] JSXExpressionContainer Literal[value=/bg-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|teal|lime|emerald|sky|violet|fuchsia|rose)-/]',
          message:
            'Use design token colors instead of hardcoded Tailwind colors. Import from @/lib/design-tokens or use StatusBadge component.',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] JSXExpressionContainer Literal[value=/text-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|teal|lime|emerald|sky|violet|fuchsia|rose)-/]',
          message:
            'Use design token colors instead of hardcoded Tailwind colors. Import from @/lib/design-tokens or use StatusBadge component.',
        },
        {
          selector:
            'JSXElement[openingElement.name.name="button"]:not([openingElement.attributes.0.name.name="type"]):not([openingElement.attributes.0.value.value="button"])',
          message:
            'Use Button component from @/components/ui/button instead of raw <button> elements.',
        },
      ],

      // Import restrictions - Lock error layer
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/utils/errorHandler',
              message: "Use '@/utils/errors' instead (compat layer is for legacy only).",
            },
          ],
        },
      ],

      // Prettier integration
      'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    },
  },
);
