<template>
  <div class="chat">
    <ChatBackground />
    <div class="chat-mainner">
      <!-- 聊天对话 -->
      <template v-if="!isShowChat">
        <div class="chat-button show" @click="onChatShow">
          <RightOutlined />
        </div>
      </template>
      <section class="chat-modal-wrapper" v-show="isShowChat">
        <template v-if="isShowTool">
          <div class="chat-button hide" @click="onChatHide">
            <LeftOutlined />
          </div>
        </template>
        <ChatModal />
      </section>
      <!-- 功能面板 -->
      <template v-if="isShowTool">
        <section class="tool-panel-wrapper" :class="{ full: !isShowChat }">
          <ToolPanel />
        </section>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatBackground from './components/ChatBackground.vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { ref, computed, watch } from 'vue'
import ChatModal from './components/ChatModal'
import ToolPanel from './components/ToolPanel'
import { useToolStore } from '@/store/tool'

const isShowChat = ref(true)

function onChatShow() {
  isShowChat.value = true
}

function onChatHide() {
  isShowChat.value = false
}

const toolStore = useToolStore()

const isShowTool = computed(() => toolStore.activePanel)

watch(
  () => isShowTool.value,
  (value) => {
    if (!value) {
      isShowChat.value = true
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-mainner {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: var(--spacing-md);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    gap: var(--spacing-md);

    .chat-modal-wrapper {
      flex: 1;
      height: 100%;
      position: relative;
      animation: fadeInLeft 0.4s ease-out;
    }

    .chat-button {
      width: 44px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-base);
      font-size: 18px;

      &:hover {
        background: var(--card-bg-hover);
        border-color: var(--primary-color);
        color: var(--primary-light);
        box-shadow: var(--shadow-blue);
      }

      &:active {
        transform: scale(0.96);
      }

      &.hide {
        border-top-left-radius: var(--radius-lg);
        border-bottom-left-radius: var(--radius-lg);
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 1000;

        &:hover {
          transform: translateY(-50%) translateX(-2px);
        }
      }

      &.show {
        border-top-right-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg);
        position: absolute;
        top: 50%;
        left: var(--spacing-md);
        transform: translateY(-50%);
        z-index: 1000;

        &:hover {
          transform: translateY(-50%) translateX(2px);
        }
      }
    }

    .tool-panel-wrapper {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      animation: fadeInRight 0.4s ease-out;

      &.full {
        animation: fadeIn 0.4s ease-out;
      }
    }
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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
