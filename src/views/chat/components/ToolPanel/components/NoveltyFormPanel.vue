<!-- 查新检索表单 -->
<template>
  <div class="novelty-form-panel">
    <CommonPanel title="信息采集">
      <template #header-buttons>
        <a-button shape="circle" @click="onClose">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </template>
      <div class="panel-content">
        <CommonForm ref="commonFormRef" :form-config="formConfig" />
        <section>
          <a-upload
            accept=".pdf"
            v-model:file-list="fileList"
            :before-upload="() => false"
            :multiple="false"
            :show-upload-list="true"
            @change="handleChange"
          >
            <a-button type="default">
              <upload-outlined></upload-outlined>上传文件
            </a-button>
          </a-upload>
        </section>
      </div>
      <template #footer-buttons>
        <a-button type="primary" :disabled="isRequestLoading" @click="onConfirm"
          >确认</a-button
        >
      </template>
    </CommonPanel>
    <!-- Loading -->
    <LoadingMask v-if="isRequestLoading" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import json2md from 'json2md'
import CommonPanel from './common/CommonPanel.vue'
import CommonForm from './common/CommonForm.vue'
import type { CommonFormConfig } from './common/CommonForm.vue'
import { notification } from 'ant-design-vue'
import { uploadFile } from '@/apis'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { searchDisclosure } from '@/apis'
import { useChatStore } from '@/store/chat'
import LoadingMask from '@/components/LoadingMask.vue'
import { useToolStore } from '@/store/tool'

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'dateRange',
      name: 'dateRange',
      label: '公开（公告）日期范围',
      rules: [{ required: false, message: '公开（公告）日期范围是必选项' }],
      type: 'dateRange'
    },
    {
      key: 'content',
      name: 'content',
      label: '技术方案内容',
      rules: [{ required: false, message: '技术方案内容是必填项' }],
      placeholder: '在此粘贴您的技术方案',
      type: 'textarea'
    }
  ]
})

const fileList = ref([])
const fileUrl = ref('')

async function handleChange() {
  const file = fileList.value[0] as { originFileObj: File }
  if (!file) {
    return
  }
  const savePath = 'sqs/'
  try {
    const { data: response } = await uploadFile(savePath, file.originFileObj)
    const { success, message: description, data } = response
    if (!success) {
      notification.error({ message: '文件上传失败', description })
      return
    }
    fileUrl.value = data.resourceUrl
    notification.success({ message: '文件上传成功' })
  } catch (err) {
    console.warn(err)
  }
}

const chatStore = useChatStore()
const toolStore = useToolStore()

function onClose() {
  toolStore.closeToolPanel()
}

const isRequestLoading = ref(false)

async function handleNoveltyFormPanelConfirm({
  markdown,
  fileUrl
}: {
  markdown: string
  fileUrl?: string
}) {
  console.log('{ markdown, fileUrl: fileUrl.value }', { markdown, fileUrl })
  // 插入系统提示消息
  chatStore.addMessage({
    role: 'assistant',
    type: 'text',
    data: [{ type: 'text', data: '请查看右侧预览窗口，正在生成中...' }]
  })
  try {
    isRequestLoading.value = true
    const { data: response } = await searchDisclosure({
      sessionId: chatStore.currentChatId,
      question: markdown || '帮我把这份技术交底书查新一下',
      fileUrl
    })
    const { success, message: description, data } = response as any
    if (!success) {
      notification.error({ message: '查新检索失败', description })
      return
    }
    const { markdown_report } = data as any
    // 打开预览 - 交底书查新
    toolStore.openPreviewPanel('novelty', markdown_report)
  } catch (error) {
    console.warn(error)
  } finally {
    isRequestLoading.value = false
  }
}

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { dateRange, content } = formData || {}
    let markdown = ''
    if (dateRange && content) {
      const [sDate, lDate] = dateRange
      markdown = json2md([
        { h1: '公开（公告）日期范围' },
        { p: `${sDate.format('YYYY-MM-DD')}~${lDate.format('YYYY-MM-DD')}` },
        { h1: '技术方案内容' },
        { p: content }
      ])
    }
    if (!markdown && !fileUrl.value) {
      notification.error({ message: '请填写表单或上传文件' })
      return
    }
    await handleNoveltyFormPanelConfirm({ markdown, fileUrl: fileUrl.value })
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.novelty-form-panel {
  width: 100%;
  height: 100%;
  position: relative;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
