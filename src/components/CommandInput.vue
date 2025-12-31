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
      <template v-if="isLoading">
        <span class="loading"><LoadingOutlined :spin="true" /></span>
      </template>
      <template v-else>
        <a-button type="primary" size="large" @click="onExec">
          <template #icon><RightCircleOutlined /></template>执行
        </a-button>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
interface ComponentProps {
  isLoading?: boolean
}

export interface ExecParams {
  userCommand: string
}
</script>

<script lang="ts" setup>
import { RightCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'

const userCommand = ref('')

withDefaults(defineProps<ComponentProps>(), { isLoading: false })

const emit = defineEmits(['exec'])

function onExec() {
  if (!userCommand.value) {
    return
  }
  const params: ExecParams = {
    userCommand: userCommand.value
  }
  emit('exec', params)
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
  }

  .button-wrapper {
    width: auto;
    height: auto;
    position: absolute;
    right: -1px;

    .loading {
      width: 100px;
      height: 48px;
      border-radius: 24px;
      background-color: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: not-allowed;
      font-size: 24px;
    }
  }
}
</style>

<style scoped>
:deep(.ant-input) {
  height: 48px;
  border-radius: 24px;
  padding: 6px 16px;
  padding-right: calc(100px + 16px);
}
:deep(.ant-btn) {
  width: 100px;
  height: 48px;
  border-radius: 24px;
}
</style>
