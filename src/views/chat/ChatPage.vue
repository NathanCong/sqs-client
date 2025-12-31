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
          <div class="chat-button hide" @click="onChatHide">
            <LeftOutlined />
          </div>
          <ChatModal
            ref="chatModalRef"
            :chatList="chatStore.currentChatList"
            :execDisabled="execDisabled"
            @exec="onExec"
          />
        </section>
      </template>
      <!-- 功能面板 -->
      <template v-if="true">
        <section class="tool-panel-wrapper">
          <ToolPanel
            @onAdvancedFormPanelConfirm="handleOthers"
            @onBatchFormPanelConfirm="handleOthers"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatModal from './components/ChatModal.vue'
import ToolPanel from './components/ToolPanel'
// import { consultStream } from '@/apis'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'
// import { PATENT_TABLE_COLUMNS } from '@/consts'

const isShowChat = ref(true)

function onChatShow() {
  isShowChat.value = true
}

function onChatHide() {
  isShowChat.value = false
}

// 定义 states
const chatModalRef = ref<InstanceType<typeof ChatModal>>()
const requestLoading = ref(false)
const route = useRoute()
// const router = useRouter()

// 定义 store
const chatStore = useChatStore()
const toolStore = useToolStore()

// 定义计算属性
const execDisabled = computed(() => requestLoading.value)

/**
 * 处理其他咨询
 */
async function handleOthers(userCommand: string) {
  console.log('userCommand', userCommand)
}

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
//             // 关闭所有面板
//             toolStore.closeAllPanels()
//             toolStore.openPreviewPanel('list', {
//               columns: PATENT_TABLE_COLUMNS,
//               dataSource: sources,
//               total: sources.length,
//               pageNum: 1,
//               pageSize: sources.length
//             })
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
  // 创建新对话
  chatStore.create()
  // 关闭所有面板
  toolStore.closeAllPanels()
  // 处理路由参数
  const { key } = route.query
  switch (key) {
    case '1':
      const userCommand = window.localStorage.getItem('userCommand') || ''
      onExec({ userCommand })
      break
    case '2':
      // 插入系统预设对话
      // chatStore.add('assistant', 'text', '好的，请先在右侧完善信息')
      // chatModalRef.value?.scrollToBottom()
      // toolStore.openAdvancedFormPanel() // 打开工具面板
      break
    case '3':
      // chatStore.add('assistant', 'text', '好的，请先在右侧完善信息') // 插入系统预设对话
      // chatModalRef.value?.scrollToBottom()
      // toolStore.openBatchFormPanel() // 打开工具面板
      break
    case '4':
      break
    case '5':
      // 插入系统预设对话
      chatStore.add('user', 'text', '请帮我写一篇技术交底书')
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息')
      chatModalRef.value?.scrollToBottom()
      // 打开专利工具面板
      toolStore.openDisclosureFormPanel()
      break
    case '6':
      // 插入系统预设对话
      chatStore.add('user', 'text', '请帮我写一篇专利')
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息')
      chatModalRef.value?.scrollToBottom()
      // 打开专利工具面板
      toolStore.openPatentFormPanel()
      break
    case '7':
      break
    default:
  }
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
