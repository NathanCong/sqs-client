import typescriptParser from '@typescript-eslint/parser'
import vueEslintConfig from 'eslint-plugin-vue'
import vueTypescriptEslintConfig from '@vue/eslint-config-typescript'
import vuePrettierEslintConfig from '@vue/eslint-config-prettier'

export default [
  {
    ignores: ['.husky/', 'dist/', 'node_modules/']
  },
  {
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        project: ['./tsconfig.json']
      }
    },
    rules: {
      // 你可以在这里添加自定义规则
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  },
  // Vue 3 推荐规则
  ...vueEslintConfig.configs['flat/essential'],
  // Vue TypeScript 配置
  ...vueTypescriptEslintConfig(),
  // Vue Prettier 配置
  vuePrettierEslintConfig
]
