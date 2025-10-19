<template>
  <div class="user-login-status">
    <!-- 用户登录头像 -->
    <span class="user-login-avatar">
      <!-- 用户已经登录，并且有用户头像 -->
      <template v-if="userloginStatus && userLoginAvatarUrl">
        <img :src="userLoginAvatarUrl" />
      </template>
      <!-- 用户已经登录，但是没有用户头像 -->
      <template v-else-if="userloginStatus && !userLoginAvatarUrl">
        {{ userLoginName.slice(0, 1) }}
      </template>
      <!-- 用户未登录 -->
      <template v-else>
        <UserOutlined />
      </template>
    </span>
    <!-- 用户登录状态 -->
    <span class="user-login-status">
      <!-- 用户已经登录，直接展示用户登录名 -->
      <template v-if="userloginStatus">{{ userLoginName }}</template>
      <!-- 用户未登录，显示未登录 -->
      <template v-else>未登录</template>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const userloginStatus = ref(false) // 用户登录状态
const userLoginAvatarUrl = ref('') // 用户登录头像 URL
const userLoginName = ref('') // 用户登录名
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
    // width: 14px;
    // height: 14px;
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
