<template>
  <div class="command-input" :class="{ 'show-upload': showUpload }">
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
      <template v-if="showUpload">
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
      </template>
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
  showUpload?: boolean
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

withDefaults(defineProps<ComponentProps>(), {
  isLoading: false,
  showUpload: false
})

const fileList = ref([])

const fileName = ref('')

const fileUrl = ref('')

const uploadLoading = ref(false)

async function onChange() {
  const file = fileList.value[0] as { originFileObj: File }
  const savePath = 'sqs/'
  uploadLoading.value = true
  try {
    const { data } = await uploadFile(savePath, file.originFileObj)
    const { success, message: description, data: response } = data
    // 文件上传失败
    if (!success) {
      notification.error({ message: '文件上传失败', description })
      return
    }
    // 文件上传成功
    notification.success({ message: '文件上传成功' })
    const { resourceName, resourceType, resourceUrl } = response
    fileName.value = `${resourceName}.${resourceType}`
    fileUrl.value = resourceUrl
  } catch (err) {
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
    right: 6px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);

    .upload-button {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-file {
      font-size: 18px;
      width: 100%;
      height: 100%;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--card-bg);
      color: var(--text-secondary);
      transition: all var(--transition-base);

      &:hover {
        border-color: var(--primary-color);
        color: var(--primary-light);
        background: var(--card-bg-hover);
      }
    }

    .loading {
      width: 120px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: not-allowed;
      font-size: 18px;
      color: var(--text-primary);
      box-shadow: var(--shadow-blue);
    }
  }
}
</style>

<style scoped>
:deep(.ant-input) {
  height: 60px;
  border-radius: var(--radius-lg);
  padding: 0 var(--spacing-lg);
  padding-right: calc(120px + var(--spacing-lg) + var(--spacing-sm));
  font-size: 16px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

:deep(.ant-input::placeholder) {
  color: var(--text-muted);
}

:deep(.ant-input:hover) {
  border-color: var(--primary-color);
  background: var(--card-bg-hover);
}

:deep(.ant-input:focus) {
  border-color: var(--primary-color);
  background: var(--card-bg-hover);
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.2),
    var(--shadow-md);
  outline: none;
}

.show-upload :deep(.ant-input) {
  padding-right: calc(120px + var(--spacing-lg) + 40px + var(--spacing-sm) * 2);
}

.exec-button :deep(.ant-btn) {
  width: 120px;
  height: 48px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  border: none;
  background: var(--primary-gradient);
  color: var(--text-primary);
  box-shadow: var(--shadow-blue);
  transition: all var(--transition-base);
}

.exec-button :deep(.ant-btn:hover) {
  background: var(--secondary-gradient);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.exec-button :deep(.ant-btn:active) {
  transform: translateY(0);
}

.exec-button :deep(.ant-btn .anticon) {
  font-size: 16px;
}
</style>
