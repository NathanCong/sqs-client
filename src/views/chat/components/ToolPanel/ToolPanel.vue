<template>
  <div class="tool-panel">
    <template v-if="toolStore.tddFormPanelVisible">
      <TDDFormPanel @confirm="onTDDFormPanelConfirm" />
    </template>
    <template v-if="toolStore.tpFormPanelVisible">
      <TPFormPanel @confirm="onTPFormPanelConfirm" />
    </template>
    <template v-if="toolStore.previewPanelVisible">
      <PreviewPanel
        ref="previewPanelRef"
        :content="previewPanelContent"
        :loading="requestLoading"
        @close="onPreviewPanelClose"
        @download="onPreviewPanelDownload"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { notification } from 'ant-design-vue'
import TDDFormPanel from './components/TDDFormPanel.vue'
import TPFormPanel from './components/TPFormPanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import { useToolStore } from '@/store/tool'
import { useChatStore } from '@/store/chat'
import { helperTDDStream, helperTPStream } from '@/apis'

// 定义 states
const previewPanelContent = ref('')
const requestLoading = ref(false)
const previewPanelRef = ref()

// 定义 store
const toolStore = useToolStore()
const chatStore = useChatStore()

// 定义 watch
watch(
  () => toolStore.previewPanelVisible,
  (visible) => {
    if (!visible) {
      previewPanelContent.value = ''
    }
  }
)

function onTDDFormPanelConfirm(markdown: string) {
  // 打开 PreviewPanel
  toolStore.openPreviewPanel()
  // 插入系统提示消息
  chatStore.add('assistant', 'text', '请查看右侧预览窗口，正在生成中...')
  // 获取技术交底书
  requestLoading.value = true
  helperTDDStream(markdown, (answerForMarkdown: string) => {
    previewPanelContent.value = answerForMarkdown
    previewPanelRef.value.scrollToBottom()
  }).finally(() => {
    requestLoading.value = false
    previewPanelRef.value.scrollToBottom()
  })
}

function onTPFormPanelConfirm(markdown: string) {
  // 打开 PreviewPanel
  toolStore.openPreviewPanel()
  // 插入系统提示消息
  chatStore.add('assistant', 'text', '请查看右侧预览窗口，正在生成中...')
  // 获取技术专利
  requestLoading.value = true
  helperTPStream(markdown, (answerForMarkdown: string) => {
    previewPanelContent.value = answerForMarkdown
    previewPanelRef.value.scrollToBottom()
  }).finally(() => {
    requestLoading.value = false
    previewPanelRef.value.scrollToBottom()
  })
}

function onPreviewPanelClose() {
  toolStore.closeAllPanels()
}

function onPreviewPanelDownload() {
  notification.info({ message: '功能正在开发中，敬请期待...' })
}
</script>

<style lang="less" scoped>
.tool-panel {
  width: 100%;
  height: 100%;
}
</style>
