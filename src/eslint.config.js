import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // Базовые рекомендованные правила ESLint
  js.configs.recommended,
  
  // Рекомендованные правила для React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // Рекомендованные правила для React Hooks
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  
  // Основная конфигурация
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      // Правило для пустых строк до и после функций - ИСПРАВЛЕННАЯ ВЕРСИЯ
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'any', prev: 'function', next: 'function' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },
        { blankLine: 'any', prev: 'export', next: 'export' },
      ],

      // Правила для порядка импортов
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-native',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'expo*',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],

      // Предупреждение о неиспользуемых переменных
      'no-unused-vars': ['off'],
    },
  },
  
  // Игнорируемые файлы
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'build/',
      '*.min.js',
      '**/.*',
    ],
  },
];