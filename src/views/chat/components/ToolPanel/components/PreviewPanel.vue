<!-- 生成结果查看 -->
<template>
  <div class="preview-panel">
    <CommonPanel title="结果预览" ref="commonPanelRef">
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <!-- 专利预览 -->
        <template v-if="toolStore.previewType === 'patent'">
          <PatentPreview :data="toolStore.previewData" ref="patentPreviewRef" />
        </template>
        <!-- 交底书预览 -->
        <template v-if="toolStore.previewType === 'disclosure'">
          <DisclosurePreview
            :data="toolStore.previewData"
            ref="disclosurePreviewRef"
          />
        </template>
        <!-- 列表类型预览 -->
        <template v-if="toolStore.previewType === 'list'">
          <div class="panel-table-wrapper">
            <a-table
              :columns="tableColumns"
              :data-source="tableDataSource"
              :scroll="{ x: 1200, y: 1200 }"
              :pagination="{
                showTotal: () => `共 ${total} 条`
              }"
            />
          </div>
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
import PatentPreview from './components/PatentPreview.vue'
import DisclosurePreview from './components/DisclosurePreview.vue'
import CommonPanel from './common/CommonPanel.vue'
import { useToolStore } from '@/store/tool'
import html2pdf from 'html2pdf.js'

// 定义 Props
withDefaults(defineProps<{ loading: boolean }>(), { loading: false })

// 定义 Refs
const commonPanelRef = ref()
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
const total = computed(() => {
  if (typeof toolStore.previewData === 'object') {
    return toolStore.previewData?.total
  }
  return 0
})

// 定义 Emit
const emit = defineEmits(['close', 'download'])

// 获取 panel-content 高度
const getPanelContentHeight = () => {
  tableHeight.value = commonPanelRef.value.getContentHeight()
  console.log('tableHeight.value', tableHeight.value)
}

function onClose() {
  emit('close')
}

function exportPDF(element: HTMLElement, fileName: string) {
  if (element) {
    const exportOptions = {
      margin: [10, 5, 10, 5],
      filename: fileName,
      image: {
        type: 'jpeg' as const,
        quality: 0.98
      },
      html2canvas: {
        scale: 1,
        useCORS: true,
        scrollY: 0,
        height: element.scrollHeight // 明确指定高度
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }
    html2pdf().from(element).set(exportOptions).save()
  }
}

const patentPreviewRef = ref<InstanceType<typeof PatentPreview> | null>(null)
const disclosurePreviewRef = ref<InstanceType<typeof DisclosurePreview> | null>(
  null
)

function onDownload() {
  // 专利下载
  if (toolStore.previewType === 'patent' && patentPreviewRef.value) {
    exportPDF(patentPreviewRef.value.$el, '技术专利.pdf')
  }
  // 交底书下载
  if (toolStore.previewType === 'disclosure' && disclosurePreviewRef.value) {
    exportPDF(disclosurePreviewRef.value.$el, '技术交底书.pdf')
  }
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

    .panel-table-wrapper {
      position: absolute;
      top: 16px;
      right: 16px;
      bottom: 16px;
      left: 16px;

      ::v-deep(.ant-table-wrapper) {
        height: 100%;

        .ant-spin-nested-loading {
          height: 100%;
        }

        .ant-spin-container {
          height: 100%;
          display: flex;
          flex-direction: column;

          .ant-table {
            flex: 1;
            height: 0;
          }

          .ant-pagination {
            flex-shrink: 0;
          }
        }

        .ant-table-container {
          height: 100%;
          display: flex;
          flex-direction: column;

          > .ant-table-header {
            flex-shrink: 0;
          }

          > .ant-table-body {
            flex: 1;
            height: 0;
          }
        }
      }
    }
  }
}
</style>
