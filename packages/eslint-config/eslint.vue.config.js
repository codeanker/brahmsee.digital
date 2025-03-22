import eslint from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginQuery from '@tanstack/eslint-plugin-query'

const recommended = eslintPluginVue.configs['flat/recommended'].map((item) => {
  if (item.rules) delete item.rules['vue/multi-word-component-names']
  if (item.rules) delete item.rules['vue/singleline-html-element-content-newline']
  if (item.rules) delete item.rules['vue/html-self-closing']
  if (item.rules) delete item.rules['vue/html-indent']
  if (item.rules) delete item.rules['vue/html-closing-bracket-newline']
  return item
})

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...recommended,
      eslintConfigPrettier,
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
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
      'vue/no-mutating-props': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off', // Durch typescript ist das immer ersichtlich, dass es undefined sein kann.
      'vue/html-self-closing': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'no-unused-vars': 'off',
      'vue/no-ref-object-destructure': 'error',
      'vue/no-undef-components': ['error', { ignorePatterns: ['router-link', 'router-view'] }],
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
          order: ['script', 'template', 'style'],
        },
      ],
      'vue/require-macro-variable-name': 'error',
      'vue/define-props-declaration': 'error',
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'no-constant-binary-expression': 'error',
    },
  },
  ...pluginQuery.configs['flat/recommended']
)
