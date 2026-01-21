<template>
  <div class="home home-background">
    <CommonBackground />
    <!-- Header -->
    <section class="home-header"><GlobalHeader /></section>
    <!-- Mainer -->
    <section class="home-mainer">
      <div class="mainer-content">
        <!-- 系统提示 -->
        <div class="system-tips">
          <span class="tips-item">Hi，下午好！ 我是您的专属AI助手~</span>
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

.home-background {
  background-color: #999;
  background-image: url('@/assets/images/bg.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.home-header {
  width: 100%;
  height: 60px;
}

.home-mainer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .mainer-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

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

      .tips-item {
        font-size: 30px;
        font-weight: bold;
      }
    }

    .search-wrapper {
      margin-top: 60px;
      width: 660px;
    }

    .tools-wrapper {
      margin-top: 60px;
    }
  }
}
</style>
