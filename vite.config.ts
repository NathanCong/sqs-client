import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  // 插件（可根据需要添加 Vue 插件等）
  plugins: [vue()],

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/')
    }
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  // 服务配置
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true, // 启动时自动打开浏览器
    hmr: true
  },

  // 构建配置
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    sourcemap: false // 是否生成源码映射
  }
})
