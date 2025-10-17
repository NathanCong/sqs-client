<template>
  <div class="command-input">
    <section class="input-wrapper">
      <a-input
        placeholder="需要我做什么？"
        size="large"
        v-model:value="userCommand"
      />
    </section>
    <section class="button-wrapper">
      <a-button
        type="primary"
        size="large"
        :disabled="execDisabled"
        @click="onExec()"
      >
        <template #icon><RightCircleOutlined /></template>
        执行
      </a-button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { RightCircleOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const userCommand = ref('') // 用户指令

withDefaults(defineProps<{ execDisabled?: boolean }>(), {
  execDisabled: false
})

const emit = defineEmits(['exec'])

function onExec() {
  if (!userCommand.value) {
    return
  }
  emit('exec', { userCommand: userCommand.value })
  userCommand.value = ''
}
</script>

<style lang="less" scoped>
.command-input {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .input-wrapper {
    width: 100%;

    ::v-deep(.ant-input) {
      height: 48px;
      border-radius: 24px;
      padding: 6px 16px;
      padding-right: calc(100px + 16px);
    }
  }

  .button-wrapper {
    width: auto;
    height: auto;
    position: absolute;
    right: 0;

    ::v-deep(.ant-btn) {
      width: 100px;
      height: 48px;
      border-radius: 24px;
    }
  }
}
</style>
