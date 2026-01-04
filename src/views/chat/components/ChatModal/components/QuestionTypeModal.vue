<template>
  <a-modal
    width="400px"
    :centered="true"
    :closable="false"
    title="问题类型"
    v-model:open="visible"
    :destroy-on-close="true"
    :mask-closable="false"
  >
    <div class="selector-wrapper">
      <a-select
        style="width: 100%"
        v-model:value="selectorValue"
        placeholder="请选择问题类型"
        :options="SELECTOR_OPTIONS"
        :allow-clear="false"
        @change="onSelectorChange"
      ></a-select>
    </div>
    <template #footer>
      <a-button type="primary" :disabled="isOkDisabled" @click="onOk">
        确定
      </a-button>
      <a-button type="default" @click="onCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { SelectValue } from 'ant-design-vue/es/select'
import { SELECTOR_OPTIONS } from '../constants'

const visible = ref(false)

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

const selectorValue = ref<SelectValue>()

const isOkDisabled = computed(() => !selectorValue.value)

function onSelectorChange(value: SelectValue): void {
  selectorValue.value = value
}

const emit = defineEmits(['ok', 'cancel'])

function onOk() {
  close()
  emit('ok', selectorValue.value)
}

function onCancel() {
  close()
  emit('cancel')
}

defineExpose({ open, close })
</script>

<style lang="less" scoped>
.selector-wrapper {
  width: 100%;
  height: auto;
  margin: 16px 0;
}
</style>
