<template>
  <div class="preview-panel">
    <CommonPanel title="结果预览" ref="commonPanelRef">
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <MarkdownRender :markdown-content="content"></MarkdownRender>
        <template v-if="loading">
          <p class="panel-loading"><LoadingOutlined :spin="true" /></p>
        </template>
      </div>
      <template #footer-buttons>
        <a-button type="primary" @click="onDownload">下载</a-button>
      </template>
    </CommonPanel>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import MarkdownRender from '@/components/MarkdownRender.vue'
import CommonPanel from './common/CommonPanel.vue'

withDefaults(defineProps<{ content: string; loading: boolean }>(), {
  content: '',
  loading: false
})

const commonPanelRef = ref()

const emit = defineEmits(['close', 'download'])

function onClose() {
  emit('close')
}

function onDownload() {
  emit('download')
}

function scrollToBottom() {
  commonPanelRef.value.scrollToBottom()
}

defineExpose({ scrollToBottom })
</script>

<style lang="less" scoped>
.preview-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;

    .panel-loading {
      margin-top: 10px;
      font-size: 20px;
    }
  }
}
</style>
