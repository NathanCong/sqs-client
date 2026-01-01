<template>
  <div class="user-login-status">
    <!-- 用户登录头像 -->
    <span class="user-login-avatar">
      <!-- 用户已经登录，并且有用户头像 -->
      <template v-if="userloginStatus && userLoginAvatarUrl">
        <img :src="userLoginAvatarUrl" />
      </template>
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
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'

const userLoginAvatarUrl = ref('') // 用户登录头像 URL
const userLoginName = ref('') // 用户登录名

const userloginStatus = computed(() => userLoginName.value)

const userStore = useUserStore()

onMounted(() => {
  userLoginName.value = userStore.userEmail
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
