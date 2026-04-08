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
  width: 100%;

  .tools-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);

    .header-text {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-tertiary);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  .tools-mainer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
    width: 100%;

    .tools-item {
      height: 140px;
      border-radius: var(--radius-lg);
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding: var(--spacing-lg) var(--spacing-xl);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
      position: relative;
      overflow: hidden;

      /* 渐变装饰 */
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--primary-gradient);
        opacity: 0;
        transition: opacity var(--transition-base);
      }

      /* 背景高光 */
      &::after {
        content: '';
        position: absolute;
        top: -50%;
        right: -50%;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          circle,
          rgba(59, 130, 246, 0.1) 0%,
          transparent 70%
        );
        opacity: 0;
        transition: opacity var(--transition-slow);
      }

      &:hover {
        background: var(--card-bg-hover);
        border-color: var(--primary-color);
        transform: translateY(-4px);
        box-shadow: var(--shadow-blue);

        &::before {
          opacity: 1;
        }

        &::after {
          opacity: 1;
        }

        .tool-name {
          color: var(--primary-light);
        }
      }

      &:active {
        transform: translateY(-2px);
      }

      .tool-name {
        font-size: 20px;
        font-weight: 600;
        color: var(--text-primary);
        transition: color var(--transition-base);
        letter-spacing: 0.3px;
        position: relative;
        z-index: 1;
      }

      .tool-desc {
        font-size: 14px;
        font-weight: 400;
        color: var(--text-secondary);
        margin-top: var(--spacing-sm);
        line-height: 1.6;
        position: relative;
        z-index: 1;
      }
    }
  }
}
</style>
