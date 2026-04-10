<!-- 生成结果查看 -->
<template>
  <div class="preview-panel">
    <CommonPanel
      title="结果预览"
      :show-footer="isShowPanelFooter"
      ref="commonPanelRef"
    >
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <!-- 预览 - 列表 -->
        <template v-if="isShowListPreview">
          <ListPreview :data="toolStore.previewData" @detail="onDetail" />
        </template>
        <!-- 预览 - 交底书 -->
        <template v-if="isShowDisclosurePreview">
          <DisclosurePreview
            :data="toolStore.previewData"
            ref="disclosurePreviewRef"
          />
        </template>
        <!-- 预览 - 专利 -->
        <template v-if="isShowPatentPreview">
          <PatentPreview :data="toolStore.previewData" ref="patentPreviewRef" />
        </template>
        <!-- Loading -->
        <template v-if="loading">
          <p class="panel-loading"><LoadingOutlined :spin="true" /></p>
        </template>
      </div>
      <template #footer-buttons>
        <a-button
          type="primary"
          @click="onDownload"
          :disabled="
            toolStore.previewType !== 'patent' &&
            toolStore.previewType !== 'disclosure'
          "
        >
          下载
        </a-button>
      </template>
    </CommonPanel>
    <!-- 专利详情 -->
    <ParentDetail ref="parentDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import PatentPreview from './components/PatentPreview.vue'
import DisclosurePreview from './components/DisclosurePreview.vue'
import ListPreview from './components/ListPreview.vue'
import CommonPanel from '../common/CommonPanel.vue'
import { useToolStore } from '@/store/tool'

// import html2pdf from 'html2pdf.js'
import ParentDetail from './components/ParentDetail.vue'

// 定义 Props
withDefaults(defineProps<{ loading: boolean }>(), { loading: false })

//  定义 Stores
const toolStore = useToolStore()

// 定义计算属性
const isShowPanelFooter = computed(() => toolStore.previewType !== 'list')
const isShowListPreview = computed(() => toolStore.previewType === 'list')
const isShowDisclosurePreview = computed(
  () => toolStore.previewType === 'disclosure'
)
const isShowPatentPreview = computed(() => toolStore.previewType === 'patent')

// 定义 Refs
const commonPanelRef = ref()

// 定义 Emit
const emit = defineEmits(['close', 'download'])

function onClose() {
  emit('close')
}

// function exportPDF(element: HTMLElement, fileName: string) {
//   if (element) {
//     const exportOptions = {
//       margin: [10, 5, 10, 5],
//       filename: fileName,
//       image: {
//         type: 'jpeg' as const,
//         quality: 0.98
//       },
//       html2canvas: {
//         scale: 1,
//         useCORS: true,
//         scrollY: 0,
//         height: element.scrollHeight // 明确指定高度
//       },
//       jsPDF: {
//         unit: 'mm',
//         format: 'a4',
//         orientation: 'portrait'
//       }
//     }
//     html2pdf().from(element).set(exportOptions).save()
//   }
// }

const patentPreviewRef = ref<InstanceType<typeof PatentPreview> | null>(null)
const disclosurePreviewRef = ref<InstanceType<typeof DisclosurePreview> | null>(
  null
)

function onDownload() {
  // 专利下载
  if (toolStore.previewType === 'patent' && patentPreviewRef.value) {
    // exportPDF(patentPreviewRef.value.$el, '技术专利.pdf')
  }
  // 交底书下载
  if (toolStore.previewType === 'disclosure' && disclosurePreviewRef.value) {
    // exportPDF(disclosurePreviewRef.value.$el, '技术交底书.pdf')
  }
}

function scrollToBottom() {
  commonPanelRef.value.scrollToBottom()
}

const parentDetailRef = ref<InstanceType<typeof ParentDetail> | null>(null)

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
  }
}
</style>
