<!-- 交底书表单 -->
<template>
  <div class="disclosure-form-panel">
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
        <!-- <a-button type="primary" style="margin-right: 4px" @click="onClick">
          交底书查新
        </a-button>
        <a-button type="primary" style="margin-right: 4px" @click="onClick">
          生成专利
        </a-button> -->
        <a-button type="primary" @click="onConfirm">确认</a-button>
      </template>
    </CommonPanel>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import json2md from 'json2md'
import CommonPanel from './common/CommonPanel.vue'
import CommonForm from './common/CommonForm.vue'
import type { CommonFormConfig } from './common/CommonForm.vue'
import { notification } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { uploadFile } from '@/apis'
import { useToolStore } from '@/store/tool'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/store/chat'
import { helperDisclosureStream } from '@/apis'

const toolStore = useToolStore()
const chatStore = useChatStore()

function onClose() {
  toolStore.closeToolPanel()
}

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'title',
      name: 'title',
      label: '主题标题',
      rules: [{ required: false, message: '主题标题是必填项' }],
      placeholder: '请输入主题标题',
      type: 'input'
    },
    {
      key: 'content',
      name: 'content',
      label: '核心内容',
      rules: [{ required: false, message: '核心内容是必填项' }],
      placeholder:
        '请输入要解决的技术问题、达到的效果、以及采用的技术手段方法等',
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

async function handleDisclosureFormPanelConfirm({
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
  const makeContent = (index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      helperDisclosureStream({
        sessionId: chatStore.currentChatId,
        code: previewData[index].code,
        question: markdown || '帮我重写一下',
        fileUrl,
        onChunk: (chunk) => {
          if (chunk === '[DONE]') {
            return resolve()
          }
          previewData[index].content = chunk
            .replace(/<model_result>([\s\S]*?)<\/model_result>/g, '')
            .replace(/\n{0,2}#{1,3}([\s\S]*?)\n{1,2}/, '')
          toolStore.updatePreviewData([...previewData])
        }
      }).catch((err: unknown) => reject(err))
    })
  }
  for (let i = 0; i < previewData.length; i += 1) {
    try {
      await makeContent(i)
    } catch (err) {
      console.warn(err)
    }
  }
}

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { title, content } = formData || {}
    let markdown = ''
    if (title && content) {
      markdown = json2md([
        { h1: '主题标题' },
        { p: title },
        { h1: '主题内容' },
        { p: content }
      ])
    }
    if (!markdown && !fileUrl.value) {
      notification.error({ message: '请填写表单或上传文件' })
      return
    }
    await handleDisclosureFormPanelConfirm({ markdown, fileUrl: fileUrl.value })
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.disclosure-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
