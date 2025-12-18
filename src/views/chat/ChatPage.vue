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
        <ToolPanel
          @onAdvancedFormPanelConfirm="handleOthers"
          @onBatchFormPanelConfirm="handleOthers"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import ChatModal from './components/ChatModal.vue'
import ToolPanel from './components/ToolPanel'
import {
  consultStream,
  readFile,
  cleanFile
  // searchPatentsFromStrategy
} from '@/apis'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'
import { PATENT_TABLE_COLUMNS } from '@/consts'

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
  // 关闭所有面板
  toolStore.closeAllPanels()
  // 插入系统回话
  const assistantMessageId = chatStore.add('assistant', 'text', '正在思考...')
  chatModalRef.value?.scrollToBottom()
  // 获取历史对话
  const history = chatStore.currentChatList.map((i) => {
    return {
      role: i.messageRole,
      content: i.messageData
    }
  })
  // 获取系统回复
  requestLoading.value = true
  try {
    await cleanFile()
    await consultStream(userCommand, history, (answerForMarkdown: string) => {
      chatStore.update(assistantMessageId, answerForMarkdown)
      chatModalRef.value?.scrollToBottom()
    })
    const res = await readFile()
    if (!res) {
      return
    }
    const { patents, total_count } = res.data
    if (patents) {
      toolStore.openPreviewPanel('list', {
        columns: PATENT_TABLE_COLUMNS,
        dataSource: patents,
        total: total_count
      })
    }
  } catch (err) {
    console.warn(err)
  } finally {
    requestLoading.value = false
    chatModalRef.value?.scrollToBottom()
  }
}

function onExec({ userCommand }: { userCommand: string }) {
  chatStore.add('user', 'text', userCommand)
}

onMounted(() => {
  // 创建新对话
  chatStore.create()
  // 关闭所有面板
  toolStore.closeAllPanels()
  // toolStore.openAdvancedFormPanel()
  // toolStore.openPreviewPanel('list', {
  //   columns: PATENT_TABLE_COLUMNS,
  //   dataSource: [],
  //   total: 0,
  //   pageNum: 1,
  //   pageSize: 10
  // })
  // 处理路由参数
  const { key } = route.query
  switch (key) {
    case '1':
      break
    case '2':
      // 插入系统预设对话
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息')
      chatModalRef.value?.scrollToBottom()
      toolStore.openAdvancedFormPanel() // 打开工具面板
      break
    case '3':
      chatStore.add('assistant', 'text', '好的，请先在右侧完善信息') // 插入系统预设对话
      chatModalRef.value?.scrollToBottom()
      toolStore.openBatchFormPanel() // 打开工具面板
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
    width: 90%;
    height: 88%;
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
      flex: 1;
      // background: #999;
      margin-left: 16px;
    }
  }
}
</style>
