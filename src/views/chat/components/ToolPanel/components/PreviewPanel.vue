<!-- 生成结果查看 -->
<template>
  <div class="preview-panel">
    <CommonPanel title="结果预览" ref="commonPanelRef">
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content" ref="panelContentRef">
        <!-- 文本类型预览 -->
        <template v-if="toolStore.previewType === 'text'">
          <MarkdownRender :markdown-content="String(toolStore.previewData)" />
        </template>
        <!-- 列表类型预览 -->
        <template v-if="toolStore.previewType === 'list'">
          <a-table
            :columns="tableColumns"
            :data-source="tableDataSource"
            :scroll="{ x: 2000, y: tableHeight }"
          />
        </template>
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
import { ref, computed, onMounted } from 'vue'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import MarkdownRender from '@/components/MarkdownRender.vue'
import CommonPanel from './common/CommonPanel.vue'
import { useToolStore } from '@/store/tool'

// 定义 Props
withDefaults(defineProps<{ loading: boolean }>(), { loading: false })

// 定义 Refs
const commonPanelRef = ref()
const panelContentRef = ref<HTMLElement | null>(null)
const tableHeight = ref<number>(0)

//  定义 Stores
const toolStore = useToolStore()

// 定义计算属性
const tableColumns = computed(() => {
  if (typeof toolStore.previewData === 'object') {
    return toolStore.previewData?.columns
  }
  return []
})
const tableDataSource = computed(() => {
  if (typeof toolStore.previewData === 'object') {
    return toolStore.previewData?.dataSource
  }
  return []
})

// 定义 Emit
const emit = defineEmits(['close', 'download'])

// 获取 panel-content 高度
const getPanelContentHeight = () => {
  if (panelContentRef.value) {
    tableHeight.value = panelContentRef.value.clientHeight
  }
}

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

onMounted(() => {
  getPanelContentHeight()
})
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
