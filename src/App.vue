<template>
  <a-config-provider :locale="locale">
    <div class="app app-font">
      <component :is="layoutComponent">
        <router-view></router-view>
      </component>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import BlankLayout from '@/layouts/BlankLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

// 定义 states
const route = useRoute()
const layoutComponents: Record<string, Component> = { BlankLayout, MainLayout }
const locale = ref(zhCN)

// 定义计算属性
const layoutComponent = computed(() => {
  const { layout } = route.meta
  const layoutName: string = typeof layout === 'string' ? layout : 'BlankLayout'
  return layoutComponents[layoutName]
})
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  min-width: 1200px;
}

.app-font {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑',
    'SimSun', '宋体', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1.6;
  letter-spacing: 0.2px;
  text-rendering: optimizeLegibility;
}
</style>
