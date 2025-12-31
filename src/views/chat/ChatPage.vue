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
          <ChatModal
            ref="chatModalRef"
            :chatList="chatStore.currentChatList"
            :execDisabled="requestLoading"
            @exec="onExec"
          />
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ChatModal from './components/ChatModal'
// import { consultStream } from '@/apis'
import { useChatStore } from '@/store/chat'

const isShowChat = ref(true)

function onChatShow() {
  isShowChat.value = true
}

function onChatHide() {
  isShowChat.value = false
}

const isShowTool = ref(false)

/**
 * 待优化逻辑
 */
const chatModalRef = ref<InstanceType<typeof ChatModal>>()
const requestLoading = ref(false)
const route = useRoute()

// 定义 store
const chatStore = useChatStore()

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

// async function handleAsk(userCommand: string) {
//   const messageId = chatStore.add('assistant', 'text', '请稍等，正在思考中...')
//   let tempContent = ''
//   let toolResults: string[] = []
//   requestLoading.value = true
//   try {
//     await consultStream({
//       sessionId: chatStore.currentChatId,
//       question: userCommand,
//       onChunk: (chunk) => {
//         if (chunk === '[DONE]') {
//           if (toolResults.length > 1) {
//             const { sources } = getToolData(toolResults[1]) as {
//               sources: unknown[]
//             }
//           }
//           return
//         }
//         // 有 tool_result 情况
//         if (chunk.includes('<tool_result>')) {
//           const regex = /<tool_result>([\s\S]*?)<\/tool_result>/g
//           const matches = chunk.match(regex) || []
//           if (matches) {
//             toolResults = matches
//             tempContent = chunk.replace(regex, '')
//             chatStore.update(messageId, tempContent, toolResults, true)
//             chatModalRef.value?.scrollToBottom()
//           }
//           return
//         }
//         // 没有 tool_result 情况
//         tempContent = chunk
//         chatStore.update(messageId, tempContent, toolResults, true)
//         chatModalRef.value?.scrollToBottom()
//       }
//     })
//   } catch (err) {
//     console.warn(err)
//   } finally {
//     requestLoading.value = false
//   }
// }

function onExec({ userCommand }: { userCommand: string }) {
  chatStore.add('user', 'text', userCommand)
  // 判断查询模式
  const { key } = route.query
  if (key === '1') {
    // handleAsk(userCommand)
    return
  }
}

onMounted(() => {
  // // 创建新对话
  // chatStore.create()
  // // 处理路由参数
  // const { key } = route.query
  // switch (key) {
  //   case '1':
  //     const userCommand = window.localStorage.getItem('userCommand') || ''
  //     onExec({ userCommand })
  //     break
  //   default:
  // }
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
