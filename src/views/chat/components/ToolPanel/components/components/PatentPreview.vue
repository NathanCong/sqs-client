<template>
  <div class="patent-preview">
    <template v-for="(item, index) in listData" :key="item.code">
      <section class="patent-item">
        <!-- <p class="item-title">{{ getTitleFromCode(item.code) }}</p> -->
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
import { helperPatentStream } from '@/apis'

const props = withDefaults(defineProps<{ data: Content[] }>(), {
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

// function getTitleFromCode(code: string) {
//   switch (code) {
//     case '1':
//       return '技术领域'
//     case '2':
//       return '背景技术'
//     case '3':
//       return '发明内容-要解决的技术问题'
//     case '4':
//       return '发明内容-技术方案'
//     case '5':
//       return '发明内容-有益效果'
//     case '6':
//       return '附图说明'
//     case '7':
//       return '具体实施方式'
//     case '8':
//       return '说明书'
//     default:
//       return ''
//   }
// }

const chatStore = useChatStore()
const toolStore = useToolStore()

function reMake(index: number) {
  const { code, content } = listData.value[index]
  listData.value[index].content = ''
  toolStore.updatePreviewData([...listData.value])
  helperPatentStream({
    sessionId: chatStore.currentChatId,
    code,
    question: content,
    onChunk: (chunk) => {
      if (chunk === '[DONE]') {
        return
      }
      listData.value[index].content += chunk
      toolStore.updatePreviewData([...listData.value])
    }
  }).catch((err) => console.warn(err))
}
</script>

<style lang="less" scoped>
.patent-preview {
  .patent-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    background-color: #eee;
    margin-bottom: 16px;

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
