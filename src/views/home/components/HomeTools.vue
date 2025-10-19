<template>
  <div class="home-tools">
    <section class="tools-header">
      <span class="header-text">您可以尝试以下功能</span>
    </section>
    <section class="tools-mainer">
      <div
        class="tools-item"
        v-for="tool in toolList"
        :key="tool.key"
        @click="onClick(tool.key)"
      >
        <span class="tool-name">{{ tool.name }}</span>
        <span class="tool-desc">{{ tool.desc }}</span>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const toolList = ref([
  {
    key: '2',
    name: '专利高级检索',
    desc: '通过精确条件搜索专利、文献、论文等'
  },
  {
    key: '3',
    name: '专利批量检索',
    desc: '通过专利号等信息批量查找专利、文献'
  },
  {
    key: '4',
    name: '专利查新检索',
    desc: '根据专利内容进行相似对比分析'
  },
  {
    key: '5',
    name: '交底书撰写助手',
    desc: '根据您的需求自动撰写技术交底书'
  },
  {
    key: '6',
    name: '专利撰写助手',
    desc: '根据提供的技术交底书自动撰写专利'
  },
  {
    key: '7',
    name: '专利智能分析',
    desc: '利用搜索到的专利文献进行中和分析'
  }
])

const emit = defineEmits(['click'])

function onClick(key: string) {
  emit('click', key)
}
</script>

<style lang="less" scoped>
.home-tools {
  display: flex;
  flex-direction: column;

  .tools-header {
    .header-text {
      font-size: 14px;
      font-weight: normal;
      color: #808080;
    }
  }

  .tools-mainer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    margin-top: 10px;

    .tools-item {
      width: 378px;
      height: 114px;
      border-radius: 16px;
      background-color: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding: 0 16px;

      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }

      &:active {
        background-color: rgba(255, 255, 255, 0.7);
      }

      .tool-name {
        font-size: 20px;
        font-weight: bold;
      }

      .tool-desc {
        font-size: 16px;
        font-weight: normal;
        color: #808080;
        margin-top: 6px;
      }
    }
  }
}
</style>
