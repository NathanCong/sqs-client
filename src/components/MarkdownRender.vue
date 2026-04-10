<template>
  <div class="markdown-render" v-html="htmlContent"></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { marked } from 'marked'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = withDefaults(defineProps<{ markdownContent: string }>(), {
  markdownContent: ''
})

// 配置 marked
marked.use({
  breaks: true,
  gfm: true
})

// 处理数学公式
const renderMath = (text: string): string => {
  // 块级公式 $$...$$ (先处理块级，避免被行内公式误匹配)
  const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
  text = text.replace(blockMathRegex, (match, formula) => {
    try {
      return `<div class="katex-block">${katex.renderToString(formula.trim(), { throwOnError: false, displayMode: true })}</div>`
    } catch {
      return match
    }
  })

  // 行内公式 $...$
  const inlineMathRegex = /\$([^$\n]+?)\$/g
  text = text.replace(inlineMathRegex, (match, formula) => {
    // 如果已经被 HTML 标签包裹，跳过
    if (match.includes('<') || match.includes('>')) {
      return match
    }
    try {
      return katex.renderToString(formula.trim(), { throwOnError: false })
    } catch {
      return match
    }
  })

  return text
}

const htmlContent = computed(() => {
  // 先处理原始文本中的数学公式（在 Markdown 渲染前）
  const content = renderMath(props.markdownContent)
  // 再渲染 Markdown
  let html = marked.parse(content) as string
  // 再次处理（处理 Markdown 渲染后可能出现的公式）
  html = renderMath(html)
  return html
})
</script>

<style lang="less">
.markdown-render {
  ul,
  ol {
    padding-left: var(--spacing-lg);
  }
}
</style>
