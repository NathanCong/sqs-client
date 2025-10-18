<template>
  <div class="chat">
    <div class="chat-mainner">
      <section class="chat-modal-wrapper">
        <ChatModal
          ref="chatModalRef"
          :chatList="chatStore.currentChatList"
          :execDisabled="execDisabled"
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatModal from './components/ChatModal.vue'
import ToolPanel from './components/ToolPanel'
import { askStream, analysisSemantics } from '@/apis'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'

// 定义 states
const chatModalRef = ref<InstanceType<typeof ChatModal>>()
const requestLoading = ref(false)
const route = useRoute()

// 定义 store
const chatStore = useChatStore()
const toolStore = useToolStore()

// 定义计算属性
const execDisabled = computed(() => requestLoading.value)

/**
 * 分析用户意图
 */
function analysisUserCommand(userCommand: string) {
  // 插入用户对话
  chatStore.add('user', 'text', userCommand)
  chatModalRef.value?.scrollToBottom()
  // 分析用户意图
  return new Promise((resolve, reject) => {
    requestLoading.value = true
    analysisSemantics(userCommand)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
      .finally(() => {
        requestLoading.value = false
      })
  })
}

/**
 * 处理交底书撰写助手（测试对话：帮我写一篇技术交底书）
 */
function handleTDDWritingHepler() {
  // 插入系统预设对话
  chatStore.add('assistant', 'text', '好的，请先在右侧完善信息')
  chatModalRef.value?.scrollToBottom()
  // 打开工具面板
  toolStore.openTddFormPanel()
}

/**
 * 处理其他指令
 */
function handleOthers(userCommand: string) {
  // 插入系统回话
  const assistantMessageId = chatStore.add('assistant', 'text', '正在思考...')
  chatModalRef.value?.scrollToBottom()
  // 获取系统回复
  requestLoading.value = true
  askStream(userCommand, (answerForMarkdown: string) => {
    chatStore.update(assistantMessageId, answerForMarkdown)
    chatModalRef.value?.scrollToBottom()
  }).finally(() => {
    requestLoading.value = false
    chatModalRef.value?.scrollToBottom()
  })
}

/**
 * 通过用户意图代码执行操作
 */
function handleUserCommandFromCode(code: string, userCommand: string) {
  console.log('code:', code)
  switch (code) {
    case '1': // 专利普通检索
      break
    case '2': // 专利高级检索
      break
    case '3': // 专利批量检索
      break
    case '4': // 专利查新检索
      break
    case '5': // 交底书撰写助手
      handleTDDWritingHepler()
      break
    case '6': // 专利撰写助手
      break
    case '7': // 专利智能分析
      break
    default: // 其他（闲聊 or 咨询）
      handleOthers(userCommand)
  }
}

async function onExec({ userCommand }: ChatModalExecParams) {
  try {
    const res = await analysisUserCommand(userCommand)
    const { code } = res as AnalysisSemanticsResponse
    handleUserCommandFromCode(String(code), userCommand)
  } catch (err) {
    console.warn(err)
  }
}

onMounted(() => {
  chatStore.create() // 创建新对话
  const { key } = route.query
  switch (key) {
    case '1':
      onExec({ userCommand: window.localStorage.getItem('userCommand') || '' })
      window.localStorage.removeItem('userCommand')
      break
    case '2':
      break
    case '3':
      break
    case '4':
      break
    case '5':
      onExec({ userCommand: '帮我写一篇技术交底书' })
      break
    case '6':
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
      width: auto;
      height: 100%;
      // background: #999;
      margin-left: 16px;
    }
  }
}
</style>
