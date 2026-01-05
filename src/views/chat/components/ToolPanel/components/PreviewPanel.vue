<!-- 生成结果查看 -->
<template>
  <div class="preview-panel">
    <CommonPanel
      title="结果预览"
      :show-footer="toolStore.previewType !== 'list'"
      ref="commonPanelRef"
    >
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <!-- 专利预览（新版） -->
        <template v-if="toolStore.previewType === 'patent'">
          <PatentPreview :data="toolStore.previewData" ref="patentPreviewRef" />
        </template>
        <!-- 交底书预览（新版） -->
        <template v-if="toolStore.previewType === 'disclosure'">
          <DisclosurePreview
            :data="toolStore.previewData"
            ref="disclosurePreviewRef"
          />
        </template>
        <!-- 列表预览（新版） -->
        <template v-if="toolStore.previewType === 'list'">
          <div class="panel-table-wrapper">
            <CommonTable
              :show-header="false"
              :columns="tableColumns"
              :data-source="tableDataSource"
              :pagination="{ pageNum: 1, pageSize: 20, total }"
            >
              <!-- 表头单元格 -->
              <template #thead-cell="{ title }">
                <span class="thead-cell">{{ title }}</span>
              </template>
              <!-- 表主体单元格 -->
              <template #tbody-cell="{ column, text, record }">
                <span class="tbody-cell">
                  <!-- 摘要太长缩短 -->
                  <template v-if="column.key === 'actions'">
                    <a-button type="link" @click="onDetail(record)">
                      查看详情
                    </a-button>
                  </template>
                  <!-- 相关性评分 -->
                  <template v-else-if="column.key === 'relevanceScore'">
                    {{ (parseFloat(text) * 100).toFixed(2) }}
                  </template>
                  <!-- 其他 -->
                  <template v-else>{{ text || '——' }}</template>
                </span>
              </template>
            </CommonTable>
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
    <ParentDetail ref="parentDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import PatentPreview from './components/PatentPreview.vue'
import DisclosurePreview from './components/DisclosurePreview.vue'
import CommonPanel from './common/CommonPanel.vue'
import CommonTable from '@/components/CommonTable.vue'
import { useToolStore } from '@/store/tool'
import html2pdf from 'html2pdf.js'
import ParentDetail from './ParentDetail.vue'

// 定义 Props
withDefaults(defineProps<{ loading: boolean }>(), { loading: false })

// 定义 Refs
const commonPanelRef = ref()

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

const parentDetailRef = ref<InstanceType<typeof ParentDetail> | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDetail(record: any) {
  parentDetailRef.value?.open(record)
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

    .panel-table-wrapper {
      position: absolute;
      top: 16px;
      right: 16px;
      bottom: 16px;
      left: 16px;

      .thead-cell,
      .tbody-cell {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
