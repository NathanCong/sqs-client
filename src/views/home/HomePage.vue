<template>
  <div class="home global-background">
    <CommonBackground />
    <!-- Header -->
    <section class="home-header"><GlobalHeader /></section>
    <!-- Mainer -->
    <section class="home-mainer">
      <div class="mainer-content">
        <!-- 系统提示 -->
        <div class="system-tips">
          <span class="tips-subtitle">AI 专利检索分析平台</span>
          <span class="tips-item">智能搜索 · 深度分析 · 专业洞察</span>
        </div>
        <!-- 搜索栏 -->
        <div class="search-wrapper"><CommandInput @exec="onExec" /></div>
        <!-- 功能快捷入口 -->
        <div class="tools-wrapper">
          <HomeTools :toolList="TOOL_LIST" @active="onActive" />
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import CommonBackground from '@/components/CommonBackground.vue'
import { useRouter } from 'vue-router'
import { setStorage } from '@/utils/storage'
import GlobalHeader from '@/components/GlobalHeader'
import CommandInput from '@/components/CommandInput.vue'
import type { ExecParams } from '@/components/CommandInput.vue'
import { TOOL_LIST } from './constants/index'
import HomeTools from './components/HomeTools.vue'
import type { ActiveParams } from './components/HomeTools.vue'
import { notification } from 'ant-design-vue'

const router = useRouter()

function onExec({ userCommand }: ExecParams) {
  setStorage('userCommand', userCommand)
  router.replace({ path: '/chat', query: { key: '1' } })
}

function onActive({ key }: ActiveParams) {
  if (['2', '3', '4', '5', '6', '7'].includes(key)) {
    notification.info({
      message: '提示',
      description: 'POC 验证阶段，功能暂未开放！'
    })
    return
  }
  router.replace({ path: '/chat', query: { key } })
}
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home-header {
  width: 100%;
  height: 60px;
  position: relative;
  z-index: 999;
}

.home-mainer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 999;

  .mainer-content {
    width: 100%;
    max-width: 1400px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    animation: fadeInUp 0.6s ease-out;
    padding: 0 var(--spacing-xl);

    .system-tips,
    .search-wrapper,
    .tools-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .system-tips {
      text-align: center;
      flex-direction: column;
      gap: var(--spacing-md);

      .tips-subtitle {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-secondary);
        letter-spacing: 2px;
        text-transform: uppercase;
        opacity: 0;
        animation: fadeInDown 0.6s ease-out 0.2s forwards;
      }

      .tips-item {
        font-size: 48px;
        font-weight: 700;
        color: var(--text-primary);
        letter-spacing: 1px;
        line-height: 1.3;
        background: linear-gradient(
          135deg,
          var(--primary-light) 0%,
          var(--accent-color) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 0;
        animation: fadeInDown 0.6s ease-out 0.4s forwards;
      }
    }

    .search-wrapper {
      margin-top: 56px;
      width: 100%;
      max-width: 800px;
      opacity: 0;
      animation: fadeIn 0.6s ease-out 0.6s forwards;
    }

    .tools-wrapper {
      margin-top: 72px;
      opacity: 0;
      animation: fadeIn 0.6s ease-out 0.8s forwards;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
