<template>
  <a-modal v-model:open="visible" title="编辑表达式" @ok="onOk">
    <div class="modal-content">
      <a-textarea
        v-model:value="expressionText"
        style="width: 100%; height: 180px"
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { notification } from 'ant-design-vue'
import { useSearchStore } from '@/store/search'

const visible = ref(false)

const expressionText = ref('')

const recordData = ref<any>({})

function open(data: any) {
  visible.value = true
  expressionText.value = data.expressionText
  recordData.value = { ...data }
}

function close() {
  visible.value = false
}

const searchStore = useSearchStore()

const emit = defineEmits(['finish'])

function onOk() {
  if (!expressionText.value) {
    notification.error({ message: '表达式内容不能为空' })
    return
  }
  try {
    const { expressionId, resultData } = recordData.value
    searchStore.updateExpression({
      expressionId,
      resultData,
      expressionText: expressionText.value
    })
    close()
    emit('finish')
  } catch (error) {
    console.warn(error)
  }
}

defineExpose({ open, close })
</script>

<style lang="less" scoped>
.modal-content {
  padding: 16px 0;
}
</style>
