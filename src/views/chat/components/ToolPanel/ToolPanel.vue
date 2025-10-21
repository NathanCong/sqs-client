<template>
  <div class="tool-panel">
    <!-- 高级检索表单 -->
    <template v-if="toolStore.advancedFormPanelVisible">
      <AdvancedFormPanel @confirm="onAdvancedFormPanelConfirm" />
    </template>
    <!-- 批量检索表单 -->
    <template v-if="toolStore.batchFormPanelVisible">
      <BatchFormPanel @confirm="onBatchFormPanelConfirm" />
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
const previewPanelRef = ref()

// 定义 store
const toolStore = useToolStore()
const chatStore = useChatStore()

// 定义 emit
const emit = defineEmits([
  'onAdvancedFormPanelConfirm',
  'onBatchFormPanelConfirm'
])

/**
 * 高级检索 - 表单 @confirm
 */
function onAdvancedFormPanelConfirm(markdown: string) {
  console.log('onAdvancedFormPanelConfirm: ', markdown)
  emit('onAdvancedFormPanelConfirm', markdown)
}

/**
 * 批量检索 - 表单 @comfirm
 */
function onBatchFormPanelConfirm(markdown: string) {
  console.log('onBatchFormPanelConfirm: ', markdown)
  emit('onBatchFormPanelConfirm', markdown)
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
 * 交底书撰写 - 表单 @comfirm
 */
function onDisclosureFormPanelConfirm(markdown: string) {
  // 插入系统提示消息
  chatStore.add('assistant', 'text', '请查看右侧预览窗口，正在生成中...')
  // 打开 PreviewPanel
  toolStore.openPreviewPanel('text', '')
  // 获取技术交底书
  requestLoading.value = true
  helperDisclosureStream(markdown, (answerForMarkdown: string) => {
    toolStore.updatePreviewData(answerForMarkdown)
    previewPanelRef.value.scrollToBottom()
  }).finally(() => {
    requestLoading.value = false
    previewPanelRef.value.scrollToBottom()
  })
}

/**
 * 专利撰写 - 表单 @comfirm
 */
function onPatentFormPanelConfirm(markdown: string) {
  // 插入系统提示消息
  chatStore.add('assistant', 'text', '请查看右侧预览窗口，正在生成中...')
  // 打开 PreviewPanel
  toolStore.openPreviewPanel('text', '')
  // 获取技术专利
  requestLoading.value = true
  helperPatentStream(markdown, (answerForMarkdown: string) => {
    toolStore.updatePreviewData(answerForMarkdown)
    previewPanelRef.value.scrollToBottom()
  }).finally(() => {
    requestLoading.value = false
    previewPanelRef.value.scrollToBottom()
  })
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
