<template>
  <a-modal
    v-model:open="visible"
    title="用户信息"
    :centered="true"
    :destroy-on-close="true"
    @ok="onOk"
    ok-text="保存"
  >
    <div class="modal-content">
      <CommonForm
        layout="horizontal"
        :colon="true"
        :fields="fields"
        ref="commonFormRef"
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import CommonForm from '@/components/CommonForm.vue'
import { useUserStore } from '@/store/user'

const fields = ref<FieldItem[]>([
  {
    key: 'userEmail',
    name: 'userEmail',
    label: '用户邮箱',
    type: 'input',
    rules: [{ required: true, message: '用户邮箱不能为空' }],
    options: { disabled: true }
  },
  {
    key: 'userName',
    name: 'userName',
    label: '用户姓名',
    type: 'input',
    rules: [{ required: true, message: '用户姓名不能为空' }]
  },
  {
    key: 'userPhone',
    name: 'userPhone',
    label: '用户手机号',
    type: 'input',
    rules: [{ required: true, message: '用户手机号不能为空' }]
  }
])

const visible = ref(false)

const commonFormRef = ref<InstanceType<typeof CommonForm> | null>(null)

const userStore = useUserStore()

const userInfo = ref<any>(null)

watch(
  visible,
  async (newVisible) => {
    if (!newVisible) {
      return
    }
    try {
      userInfo.value = await userStore.getUserInfo()
      if (userInfo.value) {
        commonFormRef.value?.setFields(userInfo.value)
      }
    } catch (error) {
      console.warn('watch visible error', error)
    }
  },
  { immediate: true }
)

function open() {
  visible.value = true
}

function close() {
  visible.value = false
}

async function onOk() {
  try {
    const values = await commonFormRef.value?.submit()
    console.log('values', values)
    await userStore.setUserInfo({ ...userInfo.value, ...values })
    close()
  } catch (error) {
    console.warn('onOk error', error)
  }
}

defineExpose({ open, close })
</script>

<style lang="less" scoped>
.modal-content {
  padding: var(--spacing-md) 0;
}
</style>
