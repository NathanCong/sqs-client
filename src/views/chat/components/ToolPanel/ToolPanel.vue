<template>
  <div class="tool-panel">
    <!-- 高级检索表单 -->
    <template v-if="toolStore.advancedFormPanelVisible">
      <AdvancedFormPanel @confirm="onAdvancedFormPanelConfirm" />
    </template>
    <!-- 批量检索表单 -->
    <template v-if="toolStore.batchFormPanelVisible">
      <BatchFormPanel />
    </template>
    <!-- 查新检索表单 -->
    <template v-if="toolStore.noveltyFormPanelVisible">
      <NoveltyFormPanel @confirm="onNoveltyFormPanelConfirm" />
    </template>
    <!-- 交底书撰写表单 -->
    <template v-if="toolStore.disclosureFormPanelVisible">
      <DisclosureFormPanel @confirm="onDisclosureFormPanelConfirm" />
    </template>
    <!-- 专利撰写表单 -->
    <template v-if="toolStore.patentFormPanelVisible">
      <PatentFormPanel @confirm="onPatentFormPanelConfirm" />
    </template>
    <!-- 结果预览 -->
    <template v-if="toolStore.previewPanelVisible">
      <PreviewPanel
        ref="previewPanelRef"
        :loading="requestLoading"
        @close="onPreviewPanelClose"
        @download="onPreviewPanelDownload"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notification } from 'ant-design-vue'
import AdvancedFormPanel from './components/NewAdvancedFormPanel.vue'
import BatchFormPanel from './components/BatchFormPanel.vue'
import NoveltyFormPanel from './components/NoveltyFormPanel.vue'
import DisclosureFormPanel from './components/DisclosureFormPanel.vue'
import PatentFormPanel from './components/PatentFormPanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import { useToolStore } from '@/store/tool'
import { useChatStore } from '@/store/chat'
import { helperDisclosureStream, helperPatentStream } from '@/apis'

// 定义 states
const requestLoading = ref(false)
// const previewPanelRef = ref()

// 定义 store
const toolStore = useToolStore()
const chatStore = useChatStore()

// 定义 emit
const emit = defineEmits(['onAdvancedFormPanelConfirm'])

/**
 * 高级检索 - 表单 @confirm
 */
function onAdvancedFormPanelConfirm(markdown: string) {
  console.log('onAdvancedFormPanelConfirm: ', markdown)
  emit('onAdvancedFormPanelConfirm', markdown)
}

/**
 * 查新检索 - 表单 @comfirm
 */
function onNoveltyFormPanelConfirm(markdown: string) {
  console.log('onNoveltyFormPanelConfirm: ', markdown)
  notification.info({
    message: '温馨提示',
    description: '功能正在开发中，敬请期待...'
  })
}

/**
 * 交底书撰写（新版） - 表单 @comfirm
 */
async function onDisclosureFormPanelConfirm({
  markdown,
  fileUrl
}: {
  markdown: string
  fileUrl?: string
}) {
  // 插入系统提示消息
  chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '请查看右侧预览窗口，正在生成中...' }]
  })
  // 打开 PreviewPanel
  const previewData = [
    { code: '1', title: '标题名称', content: '' },
    { code: '2', title: '技术领域', content: '' },
    { code: '3', title: '创新背景', content: '' },
    { code: '4', title: '发明目的', content: '' },
    { code: '5', title: '技术方案', content: '' },
    { code: '6', title: '实施方案', content: '' }
  ]
  toolStore.openPreviewPanel('disclosure', previewData)
  // 获取技术交底书
  requestLoading.value = true
  const makeContent = (index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      helperDisclosureStream({
        sessionId: chatStore.currentChatId,
        code: previewData[index].code,
        question: markdown,
        fileUrl,
        onChunk: (chunk) => {
          if (chunk === '[DONE]') {
            return resolve()
          }
          previewData[index].content = chunk
            .replace(/<model_result>([\s\S]*?)<\/model_result>/g, '')
            .replace(/\n{0,2}#{1,3}([\s\S]*?)\n{1,2}/, '')
          toolStore.updatePreviewData([...previewData])
          // previewPanelRef.value.scrollToBottom()
        }
      }).catch((err) => reject(err))
    })
  }
  for (let i = 0; i < previewData.length; i += 1) {
    try {
      await makeContent(i)
    } catch (err) {
      console.warn(err)
    }
  }
  console.log('previewData', previewData)
  requestLoading.value = false
}

/**
 * 专利撰写（新版） - 表单 @comfirm
 */
async function onPatentFormPanelConfirm({
  markdown,
  fileUrl
}: {
  markdown: string
  fileUrl?: string
}) {
  // 插入系统提示消息
  chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '请查看右侧预览窗口，正在生成中...' }]
  })
  // 打开 PreviewPanel
  const previewData = [
    { code: '-1', title: '说明书' },
    { code: '1', title: '技术领域', content: '' },
    { code: '2', title: '背景技术', content: '' },
    { code: '3', title: '发明内容 - 要解决的技术问题', content: '' },
    { code: '4', title: '发明内容 - 技术方案', content: '' },
    { code: '5', title: '发明内容 - 有益效果', content: '' },
    { code: '6', title: '附图说明', content: '' },
    { code: '7', title: '实施方式', content: '' },
    { code: '-1', title: '权利要求书' },
    { code: '8', title: '独立权利要求', content: '' },
    { code: '9', title: '从属权利要求', content: '' }
  ]
  toolStore.openPreviewPanel('patent', previewData)
  // 获取技术专利
  requestLoading.value = true
  const makeContent = (index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (previewData[index].code === '-1') {
        return resolve()
      }
      helperPatentStream({
        sessionId: chatStore.currentChatId,
        code: previewData[index].code,
        question: markdown,
        fileUrl,
        onChunk: (chunk) => {
          if (chunk === '[DONE]') {
            return resolve()
          }
          previewData[index].content = chunk
            .replace(/<model_result>([\s\S]*?)<\/model_result>/g, '')
            .replace(/\n{0,2}#{1,3}([\s\S]*?)\n{1,2}/, '')
          toolStore.updatePreviewData([...previewData])
          // previewPanelRef.value.scrollToBottom()
        }
      }).catch((err) => reject(err))
    })
  }
  for (let i = 0; i < previewData.length; i += 1) {
    try {
      await makeContent(i)
      console.log('previewData[i]: ', previewData[i])
    } catch (err) {
      console.warn(err)
    }
  }
  requestLoading.value = false
}

/**
 * 结果预览 @close
 */
function onPreviewPanelClose() {
  toolStore.closeAllPanels()
}

/**
 * 结果预览 @download
 */
function onPreviewPanelDownload() {
  notification.info({
    message: '温馨提示',
    description: '功能正在开发中，敬请期待...'
  })
}
</script>

<style lang="less" scoped>
.tool-panel {
  width: 100%;
  height: 100%;
}
</style>
