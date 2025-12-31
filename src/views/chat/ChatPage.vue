<template>
  <div class="chat">
    <div class="chat-mainner">
      <!-- 聊天对话 -->
      <template v-if="!isShowChat">
        <div class="chat-button show" @click="onChatShow">
          <RightOutlined />
        </div>
      </template>
      <template v-if="isShowChat">
        <section class="chat-modal-wrapper">
          <template v-if="isShowTool">
            <div class="chat-button hide" @click="onChatHide">
              <LeftOutlined />
            </div>
          </template>
          <ChatModal />
        </section>
      </template>
      <!-- 功能面板 -->
      <template v-if="isShowTool">
        <section class="tool-panel-wrapper"></section>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import ChatModal from './components/ChatModal'

const isShowChat = ref(true)

function onChatShow() {
  isShowChat.value = true
}

function onChatHide() {
  isShowChat.value = false
}

const isShowTool = ref(false)
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
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .chat-modal-wrapper {
      flex: 1;
      height: 100%;
      position: relative;
    }

    .chat-button {
      width: 32px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
      cursor: pointer;

      &:hover {
        background-color: #ddd;
      }

      &:active {
        background-color: #ccc;
      }

      &.hide {
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 1000;
      }

      &.show {
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
        z-index: 1000;
      }
    }

    .tool-panel-wrapper {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      padding-left: 16px;
    }
  }
}
</style>
