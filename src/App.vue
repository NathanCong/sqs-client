<template>
  <div class="app app-font">
    <component :is="layoutComponent">
      <router-view></router-view>
    </component>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Component } from 'vue'
import { useRoute } from 'vue-router'

import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

const layoutComponents: Record<string, Component> = { BlankLayout }

const layoutComponent = computed(() => {
  const {
    meta: { layout }
  } = route
  const layoutName: string = typeof layout === 'string' ? layout : 'BlankLayout'
  console.log('layoutName', layoutName)
  return layoutComponents[layoutName]
})
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  // background-color: #999;
}

.app-font {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #333;
}
</style>
