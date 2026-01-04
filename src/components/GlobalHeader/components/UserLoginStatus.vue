<template>
  <div class="user-login-status">
    <!-- 用户登录头像 -->
    <span class="user-login-avatar">
      <template v-if="loginAvatarUrl"><img :src="loginAvatarUrl" /></template>
      <template v-else><UserOutlined /></template>
    </span>
    <!-- 用户登录状态 -->
    <span class="user-login-status">
      <template v-if="loginName">{{ loginName }}</template>
      <template v-else>未登录</template>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'

withDefaults(defineProps<{ loginAvatarUrl?: string; loginName?: string }>(), {
  loginAvatarUrl: '',
  loginName: ''
})
</script>

<style lang="less" scoped>
.user-login-status {
  display: flex;
  align-items: center;

  .user-login-avatar {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    border: 1px solid #333;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-login-status {
    margin-left: 6px;
  }
}
</style>
