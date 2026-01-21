<template>
  <div class="disclosure-preview">
    <template v-for="(item, index) in listData" :key="item.code">
      <section class="disclosure-item">
        <template v-if="item.title">
          <p class="item-title">{{ item.title }}</p>
        </template>
        <template v-if="item.content">
          <p class="item-content">
            <MarkdownRender :markdown-content="item.content" />
          </p>
        </template>
        <template v-else>
          <p class="item-loading">加载中...</p>
        </template>
        <p class="item-links">
          <a-button type="link" @click="reMake(index)">重新生成</a-button>
        </p>
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
    question: content,
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
