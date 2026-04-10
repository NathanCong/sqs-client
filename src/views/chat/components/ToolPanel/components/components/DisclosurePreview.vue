<template>
  <div class="disclosure-preview">
    <template v-for="(item, index) in listData" :key="item.code">
      <section class="disclosure-item">
        <template v-if="item.title">
          <div class="item-title">{{ item.title }}</div>
        </template>
        <template v-if="item.content">
          <div class="item-content">
            <template v-if="isEditMode && index === currentEditIndex">
              <a-textarea
                v-model:value="item.content"
                style="width: 100%; height: 200px"
              />
            </template>
            <template v-else>
              <MarkdownRender :markdown-content="item.content" />
            </template>
          </div>
        </template>
        <template v-else>
          <div class="item-loading">加载中...</div>
        </template>
        <div class="item-links">
          <template v-if="isEditMode">
            <a-button type="link" @click="finish()">编辑完成</a-button>
          </template>
          <template v-else>
            <a-button type="link" @click="edit(index)">编辑内容</a-button>
            <a-button type="link" @click="reMake(index)">重新生成</a-button>
          </template>
        </div>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import MarkdownRender from '@/components/MarkdownRender.vue'
import { ref, watch } from 'vue'
import { useChatStore } from '@/store/chat'
import { useToolStore } from '@/store/tool'
import { helperDisclosureStream } from '@/apis'

interface Content {
  code: string
  title?: string
  content: string
}

const props = withDefaults(defineProps<{ data?: Content[] }>(), {
  data: () => []
})

const listData = ref<Content[]>([])

watch(
  () => props.data,
  (data) => {
    listData.value = data
  },
  { immediate: true }
)

const chatStore = useChatStore()
const toolStore = useToolStore()

function reMake(index: number) {
  const { code, content } = listData.value[index]
  listData.value[index].content = ''
  toolStore.updatePreviewData([...listData.value])
  helperDisclosureStream({
    sessionId: chatStore.currentChatId,
    code,
    question: content || '帮我重写一下',
    onChunk: (chunk) => {
      if (chunk === '[DONE]') {
        return
      }
      console.log('chunk: ', chunk)
      listData.value[index].content = chunk
        .replace(/<model_result>([\s\S]*?)<\/model_result>/g, '')
        .replace(/\n{0,2}#{1,3}([\s\S]*?)\n{1,2}/, '')
      toolStore.updatePreviewData([...listData.value])
    }
  }).catch((err) => console.warn(err))
}

const isEditMode = ref(false)
const currentEditIndex = ref(-1)

function edit(index: number) {
  isEditMode.value = true
  currentEditIndex.value = index
}

function finish() {
  isEditMode.value = false
  currentEditIndex.value = -1
}
</script>

<style lang="less" scoped>
.disclosure-preview {
  .disclosure-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 16px;

    .item-title {
      color: #333;
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .item-content,
    .item-loading {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 16px;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .item-loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .item-links {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
