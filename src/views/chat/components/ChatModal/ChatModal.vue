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
              :score="chatMessage.score"
              :question-type="chatMessage.questionType"
            />
          </li>
        </template>
      </ul>
    </section>
    <!-- Chat Footer -->
    <section class="chat-footer">
      <CommandInput
        :is-loading="requestLoading"
        :show-upload="true"
        @exec="onExec"
      />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted } from 'vue'
import CommandInput from '@/components/CommandInput.vue'
import type { ExecParams } from '@/components/CommandInput.vue'
import ChatMessage from './components/ChatMessage.vue'
import type {
  Tool,
  Content,
  ComponentProps as Message
} from './components/ChatMessage.vue'
import { useChatStore } from '@/store/chat'
import { consultStream, searchPatents } from '@/apis'
import { TABLE_COLUMNS } from './constants'
import { getStorage, delStorage } from '@/utils/storage'
import { useRoute } from 'vue-router'
import { useToolStore } from '@/store/tool'
import { useSearchStore } from '@/store/search'
import { useUserStore } from '@/store/user'

const chatStore = useChatStore()

function handleChunk(messageId: string, chunk: string) {
  let newChunk = chunk
  const contents: Content[] = []
  // 处理 tool_use wanxiang-search-strategy
  const toolUse1Regex =
    /<tool_use name="wanxiang-search-strategy">([\s\S]*?)<\/tool_use>/g
  const toolUse1Result = toolUse1Regex.exec(newChunk)
  if (toolUse1Result) {
    // console.log('toolUse1Result', JSON.parse(toolUse1Result[1]))
    newChunk = newChunk.replace(toolUse1Regex, '')
    if (
      !contents.find(
        (i) =>
          i.type === 'tool' &&
          (i.data as Tool).name === 'wanxiang-search-strategy'
      )
    ) {
      contents.push({
        type: 'tool',
        data: {
          name: 'wanxiang-search-strategy',
          data: JSON.parse(toolUse1Result[1]),
          html: toolUse1Result[1]
        }
      })
    }
  }
  // 处理 tool_use wanxiang-patent-search
  const toolUse2Regex =
    /<tool_use name="wanxiang-patent-search">([\s\S]*?)<\/tool_use>/g
  const toolUse2Result = toolUse2Regex.exec(newChunk)
  if (toolUse2Result) {
    // console.log('toolUse2Result', JSON.parse(toolUse2Result[1]))
    newChunk = newChunk.replace(toolUse2Regex, '')
    if (
      !contents.find(
        (i) =>
          i.type === 'tool' &&
          (i.data as Tool).name === 'wanxiang-patent-search'
      )
    ) {
      contents.push({
        type: 'tool',
        data: {
          name: 'wanxiang-patent-search',
          data: JSON.parse(toolUse2Result[1]),
          html: toolUse2Result[1]
        }
      })
    }
  }
  // 处理文字
  const textContent = contents.find((i) => i.type === 'text')
  if (textContent) {
    textContent.data = newChunk
  } else {
    contents.push({ type: 'text', data: newChunk })
  }
  console.log('newChunk', newChunk)
  console.log('contents', contents)
  chatStore.setMessage(messageId, { data: contents })
}

const chatListRef = ref<Element | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (chatListRef.value) {
      chatListRef.value.scrollTop = chatListRef.value.scrollHeight
    }
  })
}

async function handleBatchQuery(q: string) {
  try {
    const { data: res } = await searchPatents({ page: 1, q })
    const {
      data: { list, total }
    } = res as { success: boolean; data: { list: unknown[]; total: number } }
    console.log('万象云查询到的条数：', total)
    return { list, total }
  } catch (error) {
    console.warn(error)
  }
}

const searchStore = useSearchStore()
const userStore = useUserStore()

async function handleList(messageId: string) {
  const message = chatStore.getMessage(messageId) as Message
  const toolItem = (message.data as Content[]).find(
    (i) =>
      i.type === 'tool' && (i.data as Tool).name === 'wanxiang-patent-search'
  )
  if (!toolItem) {
    return
  }
  const { data } = toolItem.data as Tool
  const { strategy } = data as { strategy: string; patents: string[] }
  try {
    requestLoading.value = true
    const q = (strategy as any).q
    const { userEmail = '' } = userStore.getUserInfo() || {}
    if (userEmail) {
      searchStore.addSearchHistory(userEmail, q)
    }
    const data = await handleBatchQuery(q)
    const { list } = data as { list: unknown[]; total: number }
    chatStore.addMessage({
      role: 'assistant',
      type: 'list',
      data: {
        name: '查询结果',
        columns: TABLE_COLUMNS as ColumnItem[],
        dataSource: list.map((item: any) => {
          const {
            id,
            title: { original },
            applicants,
            application_number,
            application_date,
            earliest_publication_date,
            inventors,
            assignees,
            main_ipc,
            pav
          } = item
          return {
            id,
            // 专利名称
            patentName: original,
            // 初始申请人
            initialApplicant: applicants[0].name.original,
            // 申请号
            applicationNumber: application_number,
            // 申请日
            applicationDate: application_date,
            // 公开号/公开日
            publicationDate: earliest_publication_date,
            // 发明人
            inventors: inventors
              .map((i: { name: { original: string } }) => i.name.original)
              .join(','),
            // 当前权利人
            currentAssignee: assignees[0].name.original,
            // 主分类号
            mainIpc: main_ipc.ipc,
            // 相关性评分
            // relevanceScore: sources.find(
            //   (i: { id: string }) => i.id === application_number
            // )?.score,
            // 价值评分
            valueScore: pav
          }
        }),
        // .sort((a, b) => b.relevanceScore - a.relevanceScore),
        pagination: { total: 0, pageNum: 1, pageSize: 10 }
      }
    })
  } catch (error) {
    console.warn(error)
  } finally {
    requestLoading.value = false
    scrollToBottom()
  }
}

const requestLoading = ref(false)

async function ask(messageId: string, userCommand: string, fileUrl?: string) {
  requestLoading.value = true
  try {
    await consultStream({
      sessionId: chatStore.currentChatId,
      question: userCommand,
      fileUrl,
      onChunk: (chunk) => {
        if (chunk === '[DONE]') {
          // 处理列表类型消息
          handleList(messageId)
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

function onExec(params: ExecParams) {
  const { userCommand, fileName, fileUrl } = params
  if (fileName && fileUrl) {
    chatStore.addMessage({
      role: 'user',
      type: 'pdf',
      data: { name: fileName, url: fileUrl }
    })
  }
  chatStore.addMessage({
    role: 'user',
    type: 'text',
    data: [{ type: 'text', data: userCommand }]
  })
  if (userCommand.includes('检索历史') || userCommand.includes('检索记录')) {
    chatStore.addMessage({
      role: 'assistant',
      type: 'list',
      data: {
        name: '检索历史',
        columns: [
          {
            title: '用户',
            dataIndex: 'user',
            key: 'user'
          },
          {
            title: '检索词',
            dataIndex: 'q',
            key: 'q'
          },
          {
            title: '检索时间',
            dataIndex: 'createdAt',
            key: 'createdAt'
          }
        ] as ColumnItem[],
        dataSource: searchStore.searchHistory,
        pagination: { total: 0, pageNum: 1, pageSize: 10 }
      } as any
    })
    return
  }
  const messageId = chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '正在思考中...' }]
  })
  scrollToBottom()
  ask(messageId, userCommand, fileUrl)
}

const route = useRoute()
const toolStore = useToolStore()

onMounted(() => {
  chatStore.createNewChat()
  const userCommand = getStorage('userCommand')
  if (userCommand) {
    onExec({ userCommand })
    delStorage('userCommand')
  }
  const { key } = route.query
  // 处理批量检索
  if (key === '3') {
    toolStore.openBatchFormPanel()
    chatStore.addMessage({
      role: 'assistant',
      type: 'text',
      data: [{ type: 'text', data: '请在右侧表单完善信息' }]
    })
    return
  }
  // 处理交底书撰写助手
  if (key === '5') {
    toolStore.openDisclosureFormPanel()
    chatStore.addMessage({
      role: 'assistant',
      type: 'text',
      data: [{ type: 'text', data: '请在右侧表单完善信息' }]
    })
    return
  }
  // 处理专利撰写助手
  if (key === '6') {
    toolStore.openPatentFormPanel()
    chatStore.addMessage({
      role: 'assistant',
      type: 'text',
      data: [{ type: 'text', data: '请在右侧表单完善信息' }]
    })
    return
  }
})
</script>

<style lang="less" scoped>
.chat-modal {
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  overflow: hidden;

  .chat-header {
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--border-color-light);
    background: var(--bg-elevated);
    position: relative;

    /* 渐变装饰线 */
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary-gradient);
      opacity: 0.5;
    }

    .chat-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        background: var(--primary-gradient);
        border-radius: 50%;
        box-shadow: 0 0 10px var(--primary-color);
        animation: pulse 2s ease-in-out infinite;
      }
    }
  }

  .chat-content {
    flex: 1;
    position: relative;
    background: var(--bg-secondary);

    .chat-list {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      padding: var(--spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);

      .chat-message-wrapper {
        list-style: none;
        animation: messageSlideIn 0.3s ease-out;
      }
    }
  }

  .chat-footer {
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-top: 1px solid var(--border-color-light);
    background: var(--bg-elevated);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
