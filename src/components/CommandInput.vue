<template>
  <div class="command-input">
    <!-- Input -->
    <section class="input-wrapper">
      <a-input
        placeholder="需要我做什么？"
        size="large"
        v-model:value="userCommand"
      />
    </section>
    <!-- Exec Button -->
    <section class="buttons-wrapper">
      <span class="upload-button">
        <template v-if="fileUrl">
          <span class="upload-file"><FilePdfOutlined /></span>
        </template>
        <template v-else>
          <a-upload
            accept=".pdf"
            v-model:file-list="fileList"
            :before-upload="() => false"
            :multiple="false"
            :show-upload-list="false"
            @change="onChange"
          >
            <a-button type="default" shape="circle">
              <CloudUploadOutlined />
            </a-button>
          </a-upload>
        </template>
      </span>
      <span class="exec-button">
        <template v-if="isLoading || uploadLoading">
          <span class="loading"><LoadingOutlined :spin="true" /></span>
        </template>
        <template v-else>
          <a-button type="primary" size="large" @click="onExec">
            <template #icon><RightCircleOutlined /></template>执行
          </a-button>
        </template>
      </span>
    </section>
  </div>
</template>

<script lang="ts">
interface ComponentProps {
  isLoading?: boolean
}

export interface ExecParams {
  userCommand: string
  fileName?: string
  fileUrl?: string
}
</script>

<script lang="ts" setup>
import {
  FilePdfOutlined,
  CloudUploadOutlined,
  RightCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { ref } from 'vue'
import { notification } from 'ant-design-vue'
import { uploadFile } from '@/apis'

const userCommand = ref('')

withDefaults(defineProps<ComponentProps>(), { isLoading: false })

const fileList = ref([])

const fileName = ref('')

const fileUrl = ref('')

const uploadLoading = ref(false)

async function onChange() {
  const file = fileList.value[0] as { originFileObj: File }
  const savePath = 'sqs/'
  uploadLoading.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await uploadFile(savePath, file.originFileObj)) as any
    fileName.value = `${result.resourceName}.${result.resourceType}`
    fileUrl.value = result.resourceUrl
    notification.success({ message: '文件上传成功' })
  } catch (err) {
    notification.error({ message: '文件上传失败' })
    console.warn(err)
  } finally {
    uploadLoading.value = false
  }
}

const emit = defineEmits(['exec'])

function onExec() {
  if (!userCommand.value) {
    return
  }
  const params: ExecParams = {
    userCommand: userCommand.value,
    fileName: fileName.value,
    fileUrl: fileUrl.value
  }
  emit('exec', params)
  userCommand.value = ''
  fileName.value = ''
  fileUrl.value = ''
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

  .buttons-wrapper {
    width: auto;
    height: auto;
    position: absolute;
    right: -1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .upload-button {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-file {
      font-size: 14px;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

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
  padding-right: calc(100px + 16px + 32px);
}
.exec-button :deep(.ant-btn) {
  width: 100px;
  height: 48px;
  border-radius: 24px;
}
</style>
