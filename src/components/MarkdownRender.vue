<template>
  <div class="markdown-render" v-html="htmlContent"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = withDefaults(defineProps<{ markdownContent: string }>(), {
  markdownContent: ''
})

const htmlContent = computed(() => marked.parse(props.markdownContent))
</script>

<style lang="less">
.markdown-render {
  width: 100%;
  height: 100%;

  p {
    line-height: 1.5em;
    margin-top: 6px;

    &:first-child {
      margin-top: 0;
    }
  }

  li {
    margin-left: 16px;
  }

  img {
    width: 100%;
  }
}
</style>
