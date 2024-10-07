import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    env: {
      browser: true,
      es2021: true
    },
    extends: ['standard'],
    parserOptions: {
      ecmaVersion: 12
    },
    rules: {
      eqeqeq: 'off',
      curly: 'error',
      quotes: ['error', 'double']
    },
    globals: {
      $: 'readonly'
    }
  }
]
