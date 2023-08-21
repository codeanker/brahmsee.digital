module.exports = {
  root: true,
  env: {
    es6: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-console': ['error', { allow: ['error', 'warn'] }],
  },
  overrides: [
    {
      files: ['api/**/*'],
      settings: {
        'import/resolver': {
          node: true,
        },
      },
    },
    {
      files: ['**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'vue/component-name-in-template-casing': 'warn',
        'vue/match-component-file-name': [
          'warn',
          {
            extensions: ['vue'],
          },
        ],
        'vue/no-static-inline-styles': 'warn',
        'vue/no-template-target-blank': 'warn',
        'vue/no-potential-component-option-typo': 'warn',
        'vue/multi-word-component-names': 'off',
        'vue/require-default-prop': 'off', // Durch typescript ist das immer ersichtlich, dass es undefined sein kann.
        'vue/no-ref-object-destructure': 'error',
        'vue/no-undef-components': ['error', { ignorePatterns: ['ValidationProvider', 'router-link', 'router-view'] }],
        'vue/no-unused-refs': 'error',
        'vue/no-useless-mustaches': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/v-on-function-call': 'error',
        'vue/no-unused-properties': ['error', { groups: ['props', 'data', 'computed', 'methods', 'setup'] }],
        'vue/html-button-has-type': 'error',
      },
    },
    {
      files: ['**/*.ts'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: true,
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
        ],
      },
    },
    {
      files: ['**/*.ts'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
    {
      files: ['frontend/**/*'],
      env: {
        browser: true,
      },
    },
    {
      files: ['frontend/**/*'],
      parserOptions: {
        sourceType: 'module',
      },
    },
    {
      files: ['api/test/**/*.ts'],
      env: {
        mocha: true,
      },
    },
  ],
}
