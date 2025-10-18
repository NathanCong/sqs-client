<!-- 专利表单 -->
<template>
  <div class="patent-form-panel">
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
      key: 'content',
      name: 'content',
      label: '技术交底书',
      rules: [{ required: true, message: '技术交底书是必填项' }],
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
    const markdown = json2md([{ h1: '技术交底书' }, { p: content }])
    emit('confirm', markdown)
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
