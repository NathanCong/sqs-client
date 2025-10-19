<!-- 高级检索表单 -->
<template>
  <div class="advanced-form-panel">
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
      key: 'applicationNumber',
      name: 'applicationNumber',
      label: '专利号',
      rules: [{ required: false, message: '专利号是必填项' }],
      placeholder: '请输入专利号',
      type: 'input'
    },
    {
      key: 'applicationName',
      name: 'applicationName',
      label: '专利名称',
      rules: [{ required: false, message: '专利名称是必填项' }],
      placeholder: '请输入专利名称',
      type: 'input'
    },
    {
      key: 'applicant',
      name: 'applicant',
      label: '初始申请人',
      rules: [{ required: false, message: '初始申请人是必填项' }],
      placeholder: '请输入初始申请人',
      type: 'input'
    },
    {
      key: 'applicationDateRange',
      name: 'applicationDateRange',
      label: '申请日范围',
      rules: [{ required: false, message: '申请日范围是必填项' }],
      type: 'dateRange'
    },
    {
      key: 'publicationDateRange',
      name: 'publicationDateRange',
      label: '公开号/公开日范围',
      rules: [{ required: false, message: '公开号/公开日范围是必填项' }],
      type: 'dateRange'
    },
    {
      key: 'inventor',
      name: 'inventor',
      label: '发明人',
      rules: [{ required: false, message: '发明人是必填项' }],
      placeholder: '请输入发明人',
      type: 'input'
    },
    {
      key: 'assignee',
      name: 'assignee',
      label: '当前权利人',
      rules: [{ required: false, message: '当前权利人是必填项' }],
      placeholder: '请输入当前权利人',
      type: 'input'
    }
  ]
})

// 定义 emits
const emit = defineEmits(['confirm'])

async function onConfirm() {
  try {
    const formData = (await commonFormRef.value?.submit()) || {}
    const markdowns: Record<string, string>[] = []
    formConfig.value.fields.forEach((i) => {
      markdowns.push({ h1: i.label })
      if (
        i.key === 'applicationDateRange' ||
        i.key === 'publicationDateRange'
      ) {
        const [sDate, lDate] = formData[i.key]
        markdowns.push({
          p: `${sDate.format('YYYY-mm-dd')}~${lDate.format('YYYY-mm-dd')}`
        })
        return
      }
      markdowns.push({ p: formData[i.key] })
    })
    const markdown = json2md(markdowns)
    emit('confirm', markdown)
  } catch (err) {
    console.warn(err)
  }
}
</script>

<style lang="less" scoped>
.advanced-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
