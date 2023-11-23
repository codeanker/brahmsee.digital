const importSettings = {
  'import/first': 'error',
  'import/no-duplicates': 'error',
  'import/no-unresolved': 'off',
  'import/newline-after-import': 'error',
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
      pathGroups: [
        {
          pattern: '@/**/*',
          group: 'internal',
        },
      ],
    },
  ],
}

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
      settings: {
        'import/internal-regex': '^@codeanker/',
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:import/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        'vue/component-tags-order': [
          'error',
          {
            order: [['script', 'template'], 'style'],
          },
        ],
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
        'vue/no-ref-object-reactivity-loss': 'error',
        'vue/padding-line-between-blocks': 'error',
        'vue/define-macros-order': 'error',
        'vue/block-order': [
          'error',
          {
            order: ['template', 'script', 'style'],
          },
        ],
        'vue/require-macro-variable-name': 'error',
        'vue/define-props-declaration': 'error',
        'vue/define-emits-declaration': 'error',
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/block-lang': ['error', { script: { lang: 'ts' } }],
        ...importSettings,
      },
    },
    {
      files: ['**/*.ts'],
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.base.json'], // Specify it only for TypeScript files
        tsconfigRootDir: __dirname,
      },
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      settings: {
        'import/internal-regex': '^@codeanker/',
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
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowAny: true,
            allowNullableObject: true,
            allowNullableBoolean: true,
          },
        ],
        ...importSettings,
      },
    },
    // ts rules that require a parserOptions.project
    {
      files: ['api/**/*.ts', 'frontend/**/*.ts'],
    },
    {
      files: ['**/*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended'],
      rules: {
        'no-unused-vars': [
          'error',
          { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true },
        ],
      },
    },
    {
      files: ['frontend/**/*'],
      parserOptions: {
        sourceType: 'module',
      },
      env: {
        browser: true,
      },
    },
    {
      files: ['api/test/**/*.js'],
      env: {
        mocha: true,
      },
    },
  ],
}
