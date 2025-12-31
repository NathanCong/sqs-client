<template>
  <div class="chat-modal">
    <!-- Chat Header -->
    <section class="chat-header">
      <span class="chat-title">AI助手</span>
    </section>
    <!-- Chat Content -->
    <section class="chat-content">
      <ul class="chat-list" ref="chatListRef">
        <template v-for="chatMessage in chatList" :key="chatMessage.messageId">
          <li class="chat-message-wrapper">
            <ChatMessage
              :id="chatMessage.messageId"
              :role="chatMessage.messageRole"
              :type="chatMessage.messageType"
              :data="chatMessage.messageData"
              :showRate="chatMessage.showRate"
              :rate="chatMessage.rate"
            />
          </li>
        </template>
      </ul>
    </section>
    <!-- Chat Footer -->
    <section class="chat-footer">
      <CommandInput :execDisabled="execDisabled" @exec="onExec" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import CommandInput from '@/components/CommandInput.vue'
import ChatMessage from './components/ChatMessage.vue'
import { useChatStore } from '@/store/chat'

withDefaults(
  defineProps<{ chatList?: ChatMessage[]; execDisabled?: boolean }>(),
  {
    chatList: () => [],
    execDisabled: false
  }
)

const chatListRef = ref<Element | null>(null)

// const isToolShow = ref(false)

// function handleChangeToolShow() {
//   isToolShow.value = !isToolShow.value
// }

// const emit = defineEmits(['exec'])

function onExec(params: CommandInputExecParams) {
  // emit('exec', params)
  console.log('onExec params', params)
}

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

// function getToolName(toolResult: string) {
//   const regex = /<name>([\s\S]*?)<\/name>/g
//   const matches = regex.exec(toolResult)
//   if (matches) {
//     return matches[1]
//   }
//   return ''
// }

// function getToolData(toolResult: string) {
//   const regex = /<output>([\s\S]*?)<\/output>/g
//   const matches = regex.exec(toolResult)
//   let toolData = {}
//   if (matches) {
//     try {
//       toolData = JSON.parse(matches[1])
//     } catch (err) {
//       console.warn(err)
//     }
//   }
//   return toolData
// }

defineExpose({ scrollToBottom })

const chatStore = useChatStore()

onMounted(() => {
  chatStore.create()
  chatStore.add(
    'assistant',
    'text',
    [
      {
        type: 'tool',
        data: JSON.parse('{"name":"示例工具","data":{"key":"value"}}')
      },
      { type: 'text', data: '你好' },
      {
        type: 'tool',
        data: JSON.parse('{"name":"示例工具","data":{"key":"value"}}')
      },
      { type: 'text', data: '这是一个演示消息' }
    ],
    true,
    4
  )
  chatStore.add(
    'assistant',
    'list',
    {
      name: '示例表格',
      columns: [
        { title: '列1', dataIndex: 'col1' },
        { title: '列2', dataIndex: 'col2' }
      ],
      dataSource: [
        { col1: '数据1-1', col2: '数据1-2' },
        { col1: '数据2-1', col2: '数据2-2' }
      ],
      pagination: { pageSize: 10, current: 1, total: 2 }
    },
    true,
    3
  )
  chatStore.add(
    'assistant',
    'pdf',
    {
      name: '示例PDF文件',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    true,
    2
  )
  console.log('chatStore.chatHistory', chatStore.chatHistory)
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
