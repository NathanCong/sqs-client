<!-- 高级检索表单（新示例） -->
<template>
  <div class="new-advanced-form-panel">
    <CommonPanel title="信息采集">
      <div class="panel-content">This is new advanced form panel.</div>
      <template #footer-buttons>
        <a-button type="primary" @click="onConfirm">确认</a-button>
      </template>
    </CommonPanel>
  </div>
</template>

<script lang="ts" setup>
import { notification } from 'ant-design-vue'
import CommonPanel from './common/CommonPanel.vue'

function onConfirm() {
  notification.info({
    message: '温馨提示',
    description: '功能正在开发中，敬请期待...'
  })
}
</script>

<style lang="less" setup>
.new-advanced-form-panel {
  width: 100%;
  height: 100%;

  .panel-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
  }
}
</style>
