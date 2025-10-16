<template>
  <div class="chat-modal">
    <section class="chat-header">
      <span class="chat-title">聊天对话</span>
    </section>
    <section class="chat-content">
      <ul class="chat-list">
        <li
          :class="{
            'chat-item': true,
            'user-role': chat.messageRole === 'user',
            'system-role': chat.messageRole === 'system'
          }"
          v-for="chat in chatList"
          :key="chat.messageId"
        >
          <span class="chat-avator"></span>
          <span class="chat-text">{{ chat.messageData }}</span>
        </li>
      </ul>
    </section>
    <section class="chat-footer">
      <CommandInput @exec="onExec" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CommandInput from '@/components/CommandInput.vue'

const userMessageMock = new Array(20).fill(null).map((_, index) => ({
  messageId: index,
  messageRole: 'user', // user | system
  messageType: 'text', // text | ?
  messageData: '这是一条 user 测试消息'
}))

const systemMessageMock = new Array(20).fill(null).map((_, index) => ({
  messageId: index,
  messageRole: 'system', // user | system
  messageType: 'text', // text | ?
  messageData: '这是一条 system 测试消息'
}))

const chatList = ref(userMessageMock.concat(systemMessageMock))

function onExec(command: string) {
  console.log(command)
}
</script>

<style lang="less" scoped>
.chat-modal {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;

  .chat-header {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-bottom: 1px solid #eee;

    .chat-title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .chat-content {
    flex: 1;
    position: relative;
    // background-color: #999;

    .chat-list {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: 16px;
      display: flex;
      flex-direction: column;
      background-color: #fcfcfc;

      .chat-item {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        &.user-role {
          justify-content: flex-end;

          .chat-avator {
            order: 2;
            background-color: rgba(255, 0, 255, 0.5);
          }

          .chat-text {
            order: 1;
            border-radius: 20px 8px 20px 20px;
            background: #1677ff;
            color: #fff;
            margin-right: 8px;
          }
        }

        &.system-role {
          justify-content: flex-start;

          .chat-avator {
            order: 1;
            background-color: rgba(0, 0, 255, 0.5);
          }

          .chat-text {
            order: 2;
            border-radius: 8px 20px 20px 20px;
            border: 1px solid #d9d9d9;
            background-color: #fff;
            margin-left: 8px;
          }
        }

        .chat-avator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .chat-text {
          padding: 16px;
        }
      }
    }
  }

  .chat-footer {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    border-top: 1px solid #eee;
  }
}
</style>
