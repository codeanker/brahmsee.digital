import eslint from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import typescriptEslint from 'typescript-eslint'

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
    extends: [eslint.configs.recommended, ...typescriptEslint.configs.recommended, ...recommended],
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
      // your rules
    },
  }
)
