<template>
  <div class="global-header" :style="{ backgroundColor: bgColor }">
    <div class="logo-wrapper" @click="onLogoLick">
      <span class="logo-icon"></span>
      <span class="logo-text">{{ title }}</span>
    </div>
    <div class="func-wrapper">
      <span class="func-item">
        <UserLoginStatus :loginName="userInfo?.userEmail" />
      </span>
      <template v-if="userInfo?.userEmail">
        <span class="func-item">
          <span class="logout-button" @click="onLogoutClick">
            <LogoutOutlined />
          </span>
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LogoutOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import UserLoginStatus from './components/UserLoginStatus.vue'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

withDefaults(defineProps<{ title?: string; bgColor?: string }>(), {
  title: 'AI专利检索分析平台',
  bgColor: 'transparent'
})

const router = useRouter()

function onLogoLick() {
  router.replace('/')
}

const userStore = useUserStore()

const userInfo = computed(() => userStore.getUserInfo())

function onLogoutClick() {
  userStore.delAccessToken()
  window.location.reload()
}
</script>

<style lang="less" scoped>
.global-header {
  width: 100%;
  height: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 20px;

  .logo-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;

    .logo-text {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .func-wrapper {
    width: auto;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .func-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }

      .logout-button {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
}
</style>
