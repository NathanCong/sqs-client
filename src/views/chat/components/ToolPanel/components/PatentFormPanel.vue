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
            :show-upload-list="false"
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

const toolStore = useToolStore()

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

// 定义 emits
const emit = defineEmits(['confirm'])

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { content } = formData || {}
    let markdown = ''
    if (content) {
      markdown = json2md([{ h1: '技术交底书内容' }, { p: content }])
    }
    emit('confirm', { markdown, fileUrl: fileUrl.value })
  } catch (err) {
    console.warn(err)
  }
}

const fileList = ref([])
const fileUrl = ref('')

async function handleChange() {
  const file = fileList.value[0] as { originFileObj: File }
  const savePath = 'sqs/'
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await uploadFile(savePath, file.originFileObj)) as any
    fileUrl.value = result.resourceUrl
    notification.success({ message: '文件上传成功' })
  } catch (err) {
    notification.error({ message: '文件上传失败' })
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
