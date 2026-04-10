<template>
  <div class="tool-panel">
    <!-- 批量检索 - 表单 -->
    <template v-if="toolStore.batchFormPanelVisible">
      <BatchFormPanel />
    </template>
    <!-- 查新检索 - 表单 -->
    <template v-if="toolStore.noveltyFormPanelVisible">
      <NoveltyFormPanel />
    </template>
    <!-- 交底书撰写 - 表单 -->
    <template v-if="toolStore.disclosureFormPanelVisible">
      <DisclosureFormPanel />
    </template>
    <!-- 专利撰写 - 表单 -->
    <template v-if="toolStore.patentFormPanelVisible">
      <PatentFormPanel />
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
import BatchFormPanel from './components/BatchFormPanel.vue'
import NoveltyFormPanel from './components/NoveltyFormPanel.vue'
import DisclosureFormPanel from './components/DisclosureFormPanel.vue'
import PatentFormPanel from './components/PatentFormPanel.vue'
import PreviewPanel from './components/PreviewPanel/PreviewPanel.vue'
import { useToolStore } from '@/store/tool'

// 定义 states
const requestLoading = ref(false)
// const previewPanelRef = ref()

// 定义 store
const toolStore = useToolStore()

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
