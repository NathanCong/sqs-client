<template>
  <div class="home-tools">
    <section class="tools-header">
      <span class="header-text">您可以尝试以下功能</span>
    </section>
    <section class="tools-mainer">
      <template v-for="t in toolList" :key="t.key">
        <div class="tools-item" @click="onClick(t.key)">
          <span class="tool-name">{{ t.name }}</span>
          <span class="tool-desc">{{ t.desc }}</span>
        </div>
      </template>
    </section>
  </div>
</template>

<script lang="ts">
interface ComponentProps {
  toolList: Array<{ key: string; name: string; desc: string }>
}

export interface ActiveParams {
  key: string
}
</script>

<script lang="ts" setup>
withDefaults(defineProps<ComponentProps>(), { toolList: () => [] })

const emit = defineEmits(['active'])

function onClick(key: string) {
  const params: ActiveParams = { key }
  emit('active', params)
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
