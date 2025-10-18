<template>
  <div class="tdd-panel">
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
import CommonPanel from './common/CommonPanel.vue'
import CommonForm from './common/CommonForm.vue'

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

async function onConfirm() {
  try {
    const formData = await commonFormRef.value?.submit()
    console.log('formData', formData)
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.tdd-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
