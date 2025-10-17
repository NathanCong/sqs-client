<template>
  <div class="chat">
    <section class="chat-modal-wrapper">
      <ChatModal
        :chatList="chatList"
        :execDisabled="userMessageLoading || assistantMessageLoading"
        :userMessageId="userMessageId"
        :assistantMessageId="assistantMessageId"
        :userMessageLoading="userMessageLoading"
        :assistantMessageLoading="assistantMessageLoading"
        @exec="onExec"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { v4 as createId } from 'uuid'
import ChatModal from './components/ChatModal'
import { askStream, analysisSemantics } from '@/apis'

const chatList = ref<ChatMessage[]>([])
const userMessageId = ref('')
const assistantMessageId = ref('')
const userMessageLoading = ref(false)
const assistantMessageLoading = ref(false)

function onExec(params: ChatModalExecParams) {
  const { userCommand, scrollToBottom } = params
  // 插入用户对话
  userMessageId.value = createId()
  chatList.value.push({
    messageId: userMessageId.value,
    messageRole: 'user',
    messageType: 'text',
    messageData: userCommand
  })
  // 用户语义分析
  userMessageLoading.value = true
  analysisSemantics(userCommand)
    .then((res) => {
      console.log('res: ', res)
    })
    .catch((err) => {
      console.log('err: ', err)
    })
    .finally(() => {
      userMessageLoading.value = false
    })
  // 插入系统回话
  assistantMessageId.value = createId()
  chatList.value.push({
    messageId: assistantMessageId.value,
    messageRole: 'assistant',
    messageType: 'text',
    messageData: '……'
  })
  scrollToBottom()
  // 获取系统回复
  assistantMessageLoading.value = true
  askStream(userCommand, (answerForMarkdown: string) => {
    const assistantMessageTarget = chatList.value.find(
      (i) => i.messageId === assistantMessageId.value
    )
    if (assistantMessageTarget) {
      assistantMessageTarget.messageData = answerForMarkdown
      scrollToBottom()
    }
  }).finally(() => {
    assistantMessageLoading.value = false
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
