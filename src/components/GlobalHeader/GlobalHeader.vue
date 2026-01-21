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
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 var(--spacing-xl);
  background: var(--bg-elevated);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color-light);
  transition: all var(--transition-base);
  position: relative;

  /* 专业渐变装饰线 */
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--primary-color) 50%,
      transparent 100%
    );
    opacity: 0.3;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all var(--transition-base);
    gap: var(--spacing-md);

    &:hover {
      opacity: 0.85;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
      background: var(--primary-gradient);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-blue);
      position: relative;
      overflow: hidden;

      /* 闪光效果 */
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        animation: shine 3s infinite;
      }
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  .func-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);

    .func-item {
      display: flex;
      align-items: center;
      justify-content: center;

      .logout-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        font-size: 18px;
        cursor: pointer;
        border-radius: var(--radius-sm);
        transition: all var(--transition-base);
        color: var(--text-secondary);
        border: 1px solid transparent;

        &:hover {
          background-color: var(--card-bg);
          color: var(--primary-light);
          border-color: var(--border-color);
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}
</style>
