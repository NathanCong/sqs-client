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
        <ToolPanel @onBatchFormPanelConfirm="commonSearchPatents" />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatModal from './components/ChatModal.vue'
import ToolPanel from './components/ToolPanel'
import {
  consultStream,
  analysisSemantics,
  searchPatentsFromStrategy
} from '@/apis'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'
import { PATENT_TABLE_COLUMNS } from '@/consts'

// 定义 states
const chatModalRef = ref<InstanceType<typeof ChatModal>>()
const requestLoading = ref(false)
const route = useRoute()
const router = useRouter()

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
    analysisSemantics(userCommand)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })
}

/**
 * 通用专利检索
 */
function commonSearchPatents(userCommand: string) {
  // 插入系统回话
  chatStore.add('assistant', 'text', '正在查询，请稍候...')
  chatModalRef.value?.scrollToBottom()
  // 获取系统回复
  requestLoading.value = true
  searchPatentsFromStrategy(userCommand)
    .then((res) => {
      chatStore.add('assistant', 'text', '查询完成！请在右侧列表查看')
      chatModalRef.value?.scrollToBottom()
      const { total, pageSize, pageNum, list } =
        res as SearchPatentsFromStrategyResponse
      toolStore.openPreviewPanel('list', {
        columns: PATENT_TABLE_COLUMNS,
        dataSource: list,
        total,
        pageNum,
        pageSize
      })
    })
    .catch((err) => {
      console.warn(err)
    })
    .finally(() => {
      chatModalRef.value?.scrollToBottom()
      requestLoading.value = false
    })
}

/**
 * 处理其他咨询
 */
function handleOthers(userCommand: string) {
  // 插入系统回话
  const assistantMessageId = chatStore.add('assistant', 'text', '正在思考...')
  chatModalRef.value?.scrollToBottom()
  // 获取系统回复
  requestLoading.value = true
  consultStream(userCommand, (answerForMarkdown: string) => {
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
      commonSearchPatents(userCommand)
      break
    case '2': // 专利高级检索
      break
    case '3': // 专利批量检索
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息') // 插入系统预设对话
      chatModalRef.value?.scrollToBottom()
      toolStore.openBatchFormPanel() // 打开工具面板
      break
    case '4': // 专利查新检索
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息') // 插入系统预设对话
      chatModalRef.value?.scrollToBottom()
      toolStore.openNoveltyFormPanel() // 打开工具面板
      break
    case '5': // 交底书撰写助手
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息') // 插入系统预设对话
      chatModalRef.value?.scrollToBottom()
      toolStore.openDisclosureFormPanel() // 打开工具面板
      break
    case '6': // 专利撰写助手
      chatStore.add('assistant', 'text', '好的，请先在右侧提交您的技术交底书') // 插入系统预设对话
      chatModalRef.value?.scrollToBottom()
      toolStore.openPatentFormPanel() // 打开工具面板
      break
    case '7': // 专利智能分析
      break
    default: // 其他（闲聊 or 咨询）
      handleOthers(userCommand)
  }
}

async function onExec({ userCommand }: ChatModalExecParams) {
  try {
    // 分析用户意图
    requestLoading.value = true
    const res = await analysisUserCommand(userCommand)
    requestLoading.value = false
    // 获取用户意图代码
    const { code } = res as AnalysisSemanticsResponse
    // 通过用户意图代码执行操作
    handleUserCommandFromCode(String(code), userCommand)
  } catch (err) {
    console.warn(err)
  }
}

onMounted(() => {
  // 创建新对话
  chatStore.create()
  // 关闭所有面板
  toolStore.closeAllPanels()
  // 处理路由参数
  const { key } = route.query
  const handleSimpleSearch = () => {
    const userCommand = window.localStorage.getItem('userCommand')
    if (!userCommand) {
      router.replace('/home')
      return
    }
    onExec({ userCommand })
    window.localStorage.removeItem('userCommand')
  }
  switch (key) {
    case '1':
      handleSimpleSearch()
      break
    case '2':
      break
    case '3':
      onExec({ userCommand: '帮我批量查询一批专利' })
      break
    case '4':
      onExec({ userCommand: '帮我做一个专利查新检索' })
      break
    case '5':
      onExec({ userCommand: '帮我写一篇交底书' })
      break
    case '6':
      onExec({ userCommand: '帮我写一篇专利' })
      break
    case '7':
      chatStore.add('assistant', 'text', '正在思考...')
      chatStore.add(
        'assistant',
        'text',
        '您需要先检索专利，设定分析维度之后才能进行分析哦 ~'
      )
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
