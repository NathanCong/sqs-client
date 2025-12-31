<template>
  <div class="chat-modal">
    <!-- Chat Header -->
    <section class="chat-header">
      <span class="chat-title">AI助手</span>
    </section>
    <!-- Chat Content -->
    <section class="chat-content">
      <ul class="chat-list" ref="chatListRef">
        <template
          v-for="chatMessage in chatStore.currentChatList"
          :key="chatMessage.id"
        >
          <li class="chat-message-wrapper">
            <ChatMessage
              :id="chatMessage.id"
              :role="chatMessage.role"
              :type="chatMessage.type"
              :data="chatMessage.data"
              :showRate="chatMessage.showRate"
              :rate="chatMessage.rate"
            />
          </li>
        </template>
      </ul>
    </section>
    <!-- Chat Footer -->
    <section class="chat-footer">
      <CommandInput :is-loading="requestLoading" @exec="onExec" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import CommandInput from '@/components/CommandInput.vue'
import type { ExecParams } from '@/components/CommandInput.vue'
import ChatMessage from './components/ChatMessage.vue'
import type { Content } from './components/ChatMessage.vue'
import { useChatStore } from '@/store/chat'
import { consultStream } from '@/apis'

const chatStore = useChatStore()

function getToolName(toolResult: string) {
  const matches = /<name>([\s\S]*?)<\/name>/.exec(toolResult)
  if (matches) {
    return matches[1].trim()
  }
  return ''
}

function getToolData(toolResult: string) {
  const matches = /<output>([\s\S]*?)<\/output>/.exec(toolResult)
  let toolData = {}
  if (matches) {
    try {
      toolData = JSON.parse(matches[1])
    } catch (err) {
      console.warn(err)
    }
  }
  return toolData
}

function handleChunk(messageId: string, chunk: string) {
  let newChunk = chunk
  // 处理 model_result
  const matches = /<model_result>([\s\S]*?)<\/model_result>/.exec(newChunk)
  if (matches) {
    chatStore.setMessage(messageId, { model: matches[1].trim() })
    newChunk = newChunk.replace(matches[0], '')
  }
  // 不包含 tool_result 情况，直接更新
  if (!newChunk.includes('<tool_result>')) {
    chatStore.setMessage(messageId, {
      data: [{ type: 'text', data: newChunk }]
    })
    return
  }
  // tool_result 没生成完，跳过
  if (!newChunk.includes('</tool_result>')) {
    return
  }
  // tool_result 生成完毕，拆分内容
  const regex = /(<tool_result>[\s\S]*?<\/tool_result>)/
  const results = newChunk.split(regex)
  const newData: Content[] = []
  results.forEach((content) => {
    // 空内容跳过
    if (!content) {
      return
    }
    // tool_result 内容
    if (content.includes('<tool_result>')) {
      newData.push({
        type: 'tool',
        data: {
          name: getToolName(content),
          data: getToolData(content),
          html: content
        }
      })
      return
    }
    // text 内容
    newData.push({ type: 'text', data: content })
  })
  console.log('newData', newData)
  chatStore.setMessage(messageId, { data: newData })
}

const chatListRef = ref<Element | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

const requestLoading = ref(false)

async function ask(messageId: string, userCommand: string) {
  requestLoading.value = true
  try {
    await consultStream({
      sessionId: chatStore.currentChatId,
      question: userCommand,
      onChunk: (chunk) => {
        if (chunk === '[DONE]') {
          chatStore.setMessage(messageId, { showRate: true })
          return
        }
        handleChunk(messageId, chunk)
        scrollToBottom()
      }
    })
  } catch (err) {
    console.warn(err)
  } finally {
    requestLoading.value = false
  }
}

function onExec({ userCommand }: ExecParams) {
  chatStore.addMessage({
    role: 'user',
    type: 'text',
    data: [{ type: 'text', data: userCommand }]
  })
  const messageId = chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '正在思考中...' }]
  })
  scrollToBottom()
  ask(messageId, userCommand)
}

onMounted(() => {
  chatStore.createNewChat()
})
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

      .chat-message-wrapper {
        list-style: none;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
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
