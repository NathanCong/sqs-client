<template>
  <div class="global-header" :style="{ backgroundColor: bgColor }">
    <div class="logo-wrapper" @click="handleGoHome">
      <span class="logo-icon"></span>
      <span class="logo-text">{{ title }}</span>
    </div>
    <div class="user-wrapper">
      <UserLoginStatus />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import UserLoginStatus from './components/UserLoginStatus.vue'

withDefaults(defineProps<{ title?: string; bgColor?: string }>(), {
  title: 'AI专利检索分析平台',
  bgColor: 'transparent'
})

const router = useRouter()

function handleGoHome() {
  router.replace('/home')
}
</script>

<style lang="less" scoped>
.global-header {
  width: 100%;
  height: 100%;
  min-height: 48px;
  // background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;

  .logo-wrapper {
    display: flex;
    align-items: center;
    // background-color: #999;
    cursor: pointer;

    .logo-text {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .user-wrapper {
    cursor: pointer;
  }
}
</style>
