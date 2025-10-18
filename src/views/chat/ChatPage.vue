<template>
  <div class="chat">
    <div class="chat-mainner">
      <section class="chat-modal-wrapper">
        <ChatModal
          ref="chatModalRef"
          :chatList="chatStore.currentChatList"
          :execDisabled="analysisSemanticsLoading || askStreamLoading"
          @exec="onExec"
        />
      </section>
      <section class="tool-panel-wrapper">
        <ToolPanel />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { v4 as createId } from 'uuid'
import ChatModal from './components/ChatModal.vue'
import ToolPanel from './components/ToolPanel'
import { askStream, analysisSemantics } from '@/apis'
import { useChatStore } from '@/store/chat'

const chatStore = useChatStore()
const chatModalRef = ref<InstanceType<typeof ChatModal>>()
const analysisSemanticsLoading = ref(false)
const askStreamLoading = ref(false)

function onExec(params: ChatModalExecParams) {
  const { userCommand } = params
  // 插入用户对话
  chatStore.add({
    messageId: createId(),
    messageRole: 'user',
    messageType: 'text',
    messageData: userCommand
  })
  console.log(chatStore.currentChatList)
  // 用户语义分析
  analysisSemanticsLoading.value = true
  analysisSemantics(userCommand)
    .then((res) => {
      console.log('res: ', res)
    })
    .catch((err) => {
      console.warn('err: ', err)
    })
    .finally(() => {
      analysisSemanticsLoading.value = false
    })
  // 插入系统回话
  const assistantMessageId = createId()
  chatStore.add({
    messageId: assistantMessageId,
    messageRole: 'assistant',
    messageType: 'text',
    messageData: '……'
  })
  chatModalRef.value?.scrollToBottom()
  // 获取系统回复
  askStreamLoading.value = true
  askStream(userCommand, (answerForMarkdown: string) => {
    chatStore.update(assistantMessageId, answerForMarkdown)
    chatModalRef.value?.scrollToBottom()
  }).finally(() => {
    askStreamLoading.value = false
    chatModalRef.value?.scrollToBottom()
  })
}

onMounted(() => {
  chatStore.create()
})
</script>

<style lang="less" scoped>
.chat {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .chat-mainner {
    width: 88%;
    height: 80%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .chat-modal-wrapper {
      width: auto;
      height: 100%;
      flex: 1;
    }

    .tool-panel-wrapper {
      width: 50%;
      height: 100%;
      // background: #999;
      margin-left: 16px;
    }
  }
}
</style>
