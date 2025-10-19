<template>
  <div class="common-form">
    <a-form
      ref="commonFormRef"
      :model="formState"
      :layout="formStyleConfig.layout"
      :colon="formStyleConfig.colon"
      :label-col="formStyleConfig.labelCol"
      :wrapper-col="formStyleConfig.wrapperCol"
    >
      <a-form-item
        v-for="formItem in formItems"
        :key="formItem.key"
        :label="formItem.label"
        :name="formItem.name"
        :rules="formItem.rules"
      >
        <template v-if="formItem.type === 'input'">
          <a-input
            v-model:value="formState[formItem.name]"
            :placeholder="formItem.placeholder"
            allowClear
          />
        </template>
        <template v-if="formItem.type === 'dateRange'">
          <a-range-picker
            v-model:value="formState[formItem.name]"
            style="width: 100%"
            allowClear
          />
        </template>
        <template v-if="formItem.type === 'textarea'">
          <a-textarea
            v-model:value="formState[formItem.name]"
            :placeholder="formItem.placeholder"
            allowClear
            style="width: 100%; height: 200px"
          />
        </template>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import type { FormInstance } from 'ant-design-vue'

// 定义 Props 和默认值
const props = withDefaults(defineProps<{ formConfig: CommonFormConfig }>(), {
  formConfig: () => ({ fields: [] })
})

// 定义内部数据
const formStyleConfig = reactive<CommonFormStyleConfig>({
  layout: 'vertical',
  colon: false,
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
})
let formItems = reactive<CommonFormItem[]>([])
const formState = reactive<CommonFormState>({})
const commonFormRef = ref<FormInstance | null>(null)

// 定义数据监听
watch(
  () => props.formConfig,
  (newConfig) => {
    const { layout, colon, labelCol, wrapperCol, fields } = newConfig
    // 初始化 formStyleConfig
    if (layout) {
      formStyleConfig.layout = layout
    }
    if (colon) {
      formStyleConfig.colon = colon
    }
    if (labelCol) {
      formStyleConfig.labelCol = labelCol
    }
    if (wrapperCol) {
      formStyleConfig.wrapperCol = wrapperCol
    }
    // 初始化 formItems
    formItems = fields.map((i) => i)
    // 初始化 formState
    fields.forEach((field) => {
      formState[field.name] = field.value || field.defaultValue
    })
  },
  { immediate: true }
)

function getFormState() {
  return formState
}

function setFormState(data: CommonFormState) {
  Object.assign(formState, data)
}

function reset() {
  commonFormRef.value?.resetFields()
}

function submit() {
  return commonFormRef.value?.validateFields()
}

// 定义暴露给父组件的方法
defineExpose({
  getFormState,
  setFormState,
  reset,
  submit
})
</script>

<style lang="less" scoped></style>
