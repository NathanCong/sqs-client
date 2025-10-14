import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import eslintConfigPrettier from '@vue/eslint-config-prettier'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,vue}'],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },

    plugins: {
      '@typescript-eslint': tsPlugin
    },

    rules: {
      // 你可以在这里添加自定义规则
    }
  },

  // Vue 3 推荐规则
  ...pluginVue.configs['flat/essential'],

  // TypeScript 配置
  ...vueTsEslintConfig(),

  // Prettier 配置
  eslintConfigPrettier,

  // 全局 ignores
  {
    ignores: ['.husky/', 'dist/', 'node_modules/']
  }
]
