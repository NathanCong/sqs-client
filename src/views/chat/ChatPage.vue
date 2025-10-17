<template>
  <div class="chat">
    <section class="chat-modal-wrapper">
      <ChatModal :chatList="chatList" :disabled="loading" @exec="onExec" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { v4 as createId } from 'uuid'
import ChatModal from './components/ChatModal'
import { ask } from '@/apis'

const chatList = ref<ChatMessage[]>([])
const loading = ref(false)

function onExec(params: ChatModalExecParams) {
  const { userCommand, scrollToBottom } = params
  // 插入用户对话
  const userMessageId = createId()
  chatList.value.push({
    messageId: userMessageId,
    messageRole: 'user',
    messageType: 'text',
    messageData: userCommand
  })
  // 插入系统回话
  const assistantMessageId = createId()
  chatList.value.push({
    messageId: assistantMessageId,
    messageRole: 'assistant',
    messageType: 'text',
    messageData: '……'
  })
  scrollToBottom()
  // 获取系统回复
  loading.value = true
  ask(userCommand, (answerForMarkdown: string) => {
    const assistantMessageTarget = chatList.value.find(
      (i) => i.messageId === assistantMessageId
    )
    if (assistantMessageTarget) {
      assistantMessageTarget.messageData = answerForMarkdown
      scrollToBottom()
    }
  }).finally(() => {
    loading.value = false
    scrollToBottom()
  })
}
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-modal-wrapper {
    width: 80%;
    height: 80%;
  }
}
</style>
