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
  const modelResultRegex = /<model_result>([\s\S]*?)<\/model_result>/g
  const modelResultMatches = modelResultRegex.exec(newChunk)
  if (modelResultMatches) {
    chatStore.setMessage(messageId, { model: modelResultMatches[1].trim() })
    newChunk = newChunk.replace(modelResultRegex, '')
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
  const toolResultRegex = /(<tool_result>[\s\S]*?<\/tool_result>)/
  const contentResults = newChunk.split(toolResultRegex)
  const contents: Content[] = []
  contentResults.forEach((content) => {
    // 空内容跳过
    if (!content) {
      return
    }
    // tool_result 内容
    if (content.includes('<tool_result>')) {
      contents.push({
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
    contents.push({ type: 'text', data: content })
  })
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

async function handleList(messageId: string) {
  const message = chatStore.getMessage(messageId) as Message
  const toolItem = (message.data as Content[]).find(
    (i) => i.type === 'tool' && (i.data as Tool).name === 'rag_search'
  )
  if (!toolItem) {
    return
  }
  const { data } = toolItem.data as Tool
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { sources } = data as { sources: any[] }
  requestLoading.value = true
  try {
    const q = `${sources.map((i) => `(an=${(i as { id: string }).id})`).join(' or ')}`
    console.log('向量库查询到的条数：', sources.length)
    console.log('q', q)
    const { data: res } = await searchPatents({ page: 1, q })
    const {
      data: { list, total }
    } = res as { success: boolean; data: { list: unknown[]; total: number } }
    console.log('万象云查询到的条数：', total)
    chatStore.addMessage({
      role: 'assistant',
      type: 'list',
      data: {
        name: '查询结果',
        columns: TABLE_COLUMNS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataSource: list.map((item: any) => {
          const {
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
            relevanceScore: sources
              .find((i: { id: string }) => i.id === application_number)
              ?.score.toFixed(2),
            // 价值评分
            valueScore: pav
          }
        }),
        pagination: { total: 0, pageNum: 1, pageSize: 10 }
      },
      showRate: true
    })
  } catch (error) {
    console.warn(error)
  } finally {
    requestLoading.value = false
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
          // 展示用户评分
          chatStore.setMessage(messageId, { showRate: true })
          // 处理列表类型消息
          handleList(messageId)
          scrollToBottom()
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
  const messageId = chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '正在思考中...' }]
  })
  scrollToBottom()
  ask(messageId, userCommand, fileUrl)
}

onMounted(() => {
  chatStore.createNewChat()
  const userCommand = getStorage('userCommand')
  if (userCommand) {
    onExec({ userCommand })
    delStorage('userCommand')
  }
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
