<!-- 交底书表单 -->
<template>
  <div class="disclosure-form-panel">
    <CommonPanel title="信息采集">
      <div class="panel-content">
        <CommonForm ref="commonFormRef" :form-config="formConfig" />
      </div>
      <template #footer-buttons>
        <a-button type="primary" style="margin-right: 4px" @click="onClick">
          交底书查新
        </a-button>
        <a-button type="primary" style="margin-right: 4px" @click="onClick">
          生成专利
        </a-button>
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
import { notification } from 'ant-design-vue'

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'title',
      name: 'title',
      label: '主题标题',
      rules: [{ required: true, message: '主题标题是必填项' }],
      placeholder: '请输入主题标题',
      type: 'input'
    },
    {
      key: 'content',
      name: 'content',
      label: '核心内容',
      rules: [{ required: true, message: '核心内容是必填项' }],
      placeholder: '请输入核心内容',
      type: 'textarea'
    }
  ]
})

// 定义 emits
const emit = defineEmits(['confirm'])

function onClick() {
  notification.info({
    message: '温馨提示',
    description: '功能正在开发中，敬请期待...'
  })
}

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { title, content } = formData || {}
    const markdown = json2md([
      { h1: '主题标题' },
      { p: title },
      { h1: '核心内容' },
      { p: content }
    ])
    emit('confirm', markdown)
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
