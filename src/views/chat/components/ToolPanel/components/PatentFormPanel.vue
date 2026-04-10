<!-- 专利表单 -->
<template>
  <div class="patent-form-panel">
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
import { uploadFile } from '@/apis'
import { notification } from 'ant-design-vue'
import { useToolStore } from '@/store/tool'
import { CloseOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/store/chat'
import { helperPatentStream } from '@/apis'

const toolStore = useToolStore()
const chatStore = useChatStore()

function onClose() {
  toolStore.closeAllPanels()
}

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'content',
      name: 'content',
      label: '技术交底书内容',
      rules: [{ required: false, message: '技术交底书是必填项' }],
      placeholder: '此处粘贴您的技术交底书',
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

async function handlePatentFormPanelConfirm({
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
    { code: '-1', title: '说明书' },
    { code: '1', title: '技术领域', content: '' },
    { code: '2', title: '背景技术', content: '' },
    { code: '3', title: '发明内容 - 要解决的技术问题', content: '' },
    { code: '4', title: '发明内容 - 技术方案', content: '' },
    { code: '5', title: '发明内容 - 有益效果', content: '' },
    { code: '6', title: '附图说明', content: '' },
    { code: '7', title: '实施方式', content: '' },
    { code: '-1', title: '权利要求书' },
    { code: '8', title: '独立权利要求', content: '' },
    { code: '9', title: '从属权利要求', content: '' }
  ]
  toolStore.openPreviewPanel('patent', previewData)
  // 获取技术专利
  const makeContent = (index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (previewData[index].code === '-1') {
        return resolve()
      }
      helperPatentStream({
        sessionId: chatStore.currentChatId,
        code: previewData[index].code,
        question: markdown,
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
      console.log('previewData[i]: ', previewData[i])
    } catch (err) {
      console.warn(err)
    }
  }
}

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { content } = formData || {}
    let markdown = ''
    if (content) {
      markdown = json2md([{ h1: '技术交底书内容' }, { p: content }])
    }
    console.log('{ markdown, fileUrl: fileUrl.value }', {
      markdown,
      fileUrl: fileUrl.value
    })
    if (!markdown && !fileUrl.value) {
      notification.error({ message: '请填写表单或上传文件' })
      return
    }
    await handlePatentFormPanelConfirm({ markdown, fileUrl: fileUrl.value })
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.patent-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
