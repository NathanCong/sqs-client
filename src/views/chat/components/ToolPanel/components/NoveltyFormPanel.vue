<!-- 查新检索表单 -->
<template>
  <div class="novelty-form-panel">
    <CommonPanel title="信息采集">
      <div class="panel-content">
        <CommonForm ref="commonFormRef" :form-config="formConfig" />
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

// 定义 state
const commonFormRef = ref<InstanceType<typeof CommonForm>>()
const formConfig = ref<CommonFormConfig>({
  fields: [
    {
      key: 'dateRange',
      name: 'dateRange',
      label: '公开（公告）日期范围',
      rules: [{ required: true, message: '公开（公告）日期范围是必选项' }],
      type: 'dateRange'
    },
    {
      key: 'content',
      name: 'content',
      label: '技术方案内容',
      rules: [{ required: true, message: '技术方案内容是必填项' }],
      placeholder: '在此粘贴您的技术方案',
      type: 'textarea'
    }
  ]
})

// 定义 emits
const emit = defineEmits(['confirm'])

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    const { dateRange, content } = formData || {}
    const [sDate, lDate] = dateRange
    const markdown = json2md([
      { h1: '公开（公告）日期范围' },
      { p: `${sDate.format('YYYY-MM-DD')}~${lDate.format('YYYY-MM-DD')}` },
      { h1: '技术方案内容' },
      { p: content }
    ])
    emit('confirm', markdown)
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.novelty-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
